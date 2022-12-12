import debug from 'debug'
import { Composer, InlineKeyboard } from 'grammy'
import { Router } from "@grammyjs/router"

import type { F3Context } from '../../types/F3Context'
import {
  editTransactionsMapper as mapper,
  parseAmountInput,
  formatTransaction,
  formatTransactionKeyboard,
  createCategoriesKeyboard,
  createAccountsKeyboard,
  createExpenseAccountsKeyboard,
  createEditMenuKeyboard
} from '../helpers'

import firefly from '../../libs/firefly'
import { AccountTypeFilter } from '../../libs/firefly/model/account-type-filter'

export enum Route {
  IDLE               = 'IDLE',
  CHANGE_AMOUNT      = 'EDIT_TRANSACTION|AMOUNT',
  CHANGE_DESCRIPTION = 'EDIT_TRANSACTION|DESCRIPTION'
}

const rootLog = debug(`bot:transactions:edit`)

const bot = new Composer<F3Context>()
const router = new Router<F3Context>((ctx) => ctx.session.step)

// Common for all transaction types
bot.callbackQuery(mapper.editMenu.regex(), showEditTransactionMenu)
bot.callbackQuery(mapper.done.regex(), doneEditTransactionCbQH)
bot.callbackQuery(mapper.editAmount.regex(), changeTransactionAmountCbQH)
bot.callbackQuery(mapper.editDesc.regex(), changeTransactionDescriptionCbQH)
router.route(Route.CHANGE_AMOUNT, changeAmountRouteHandler)
router.route(Route.CHANGE_DESCRIPTION, changeDescriptionRouteHandler)

// Edit Withdrawal transaction
bot.callbackQuery(mapper.editCategory.regex(), selectNewCategory)
bot.callbackQuery(mapper.setCategory.regex(), setNewCategory)
bot.callbackQuery(mapper.editAssetAccount.regex(), selectNewAssetAccount)
bot.callbackQuery(mapper.setAssetAccount.regex(), setNewAssetAccount)
bot.callbackQuery(mapper.editExpenseAccount.regex(), selectNewExpenseAccount)
bot.callbackQuery(mapper.setExpenseAccount.regex(), setNewExpenseAccount)

// Edit Deposit transaction
bot.callbackQuery(mapper.editRevenueAccount.regex(), selectNewRevenueAccount)
bot.callbackQuery(mapper.setRevenueAccount.regex(), setNewRevenueAccount)
bot.callbackQuery(mapper.editDepositAssetAccount.regex(), selectNewDepositAssetAccount)
bot.callbackQuery(mapper.setDepositAssetAccount.regex(), setNewDepositAssetAccount)

// Edit Transfer transaction
// bot.callbackQuery(mapper.editSourceAccount.regex, editSourceAccount)
// bot.callbackQuery(mapper.setSourceAccount.regex, setSourceAccount)
// bot.callbackQuery(mapper.editDestinationAccount.regex, editDestinationAccount)
// bot.callbackQuery(mapper.setDestinationAccount.regex, setDestinationAccount)

bot.use(router)

export default bot

async function showEditTransactionMenu(ctx: F3Context) {
  const log = rootLog.extend('showEditTransactionMenu')
  log('Entered showEditTransactionMenu action handler')
  try {
    log('ctx.update.callback_query.message: %O', ctx.update?.callback_query?.message)
    // Prevent all router handlers from happening
    ctx.session.step = 'IDLE'

    const userId = ctx.from!.id
    const { editTransaction } = ctx.session
    log('transaction: %O', editTransaction)

    const trId = parseInt(ctx.match![1], 10)
    log('trId: %O', trId)

    const tr =
      (await firefly(userId).Transactions.getTransaction(trId as any)).data.data

    ctx.session.editTransaction = tr

    // This is a curried function which deletes the original message.
    // We need it because having edited a transaction, we can not edit the
    // message with updated transaction from the route handler function.
    // Hence the workaround is to delete original message and then post
    // another one with the updated transaction data. This function is meant to
    // be called only from the route handler functions where a user types in
    // things as opposed to clicking on inline keyboard buttons.
    ctx.session.deleteBotsMessage = (function(ctx: F3Context) {
      const messageId = ctx.update?.callback_query?.message!.message_id || 0
      const chatId = ctx.update?.callback_query?.message!.chat.id || 0
      return function() {
        return ctx.api.deleteMessage(chatId, messageId)
      }
    })(ctx)

    const editMenuKeyboard = createEditMenuKeyboard(ctx, tr)
    log('editMenuKeyboard.inline_keyboard: %O', editMenuKeyboard.inline_keyboard)

    const message = ''.concat(
      formatTransaction(ctx, tr),
      '\n',
      ctx.i18n.t('transactions.edit.whatToEdit')
    )
    log('message: %O', message)

    return ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: editMenuKeyboard
    })

  } catch (err) {
    console.error(err)
  }
}

async function doneEditTransactionCbQH(ctx: F3Context) {
  const log = rootLog.extend('doneEditTransactionCbQH')
  try {
    const userId = ctx.from!.id
    const trId = parseInt(ctx.match![1], 10)
    log('transaction id: %O', trId)

    await ctx.answerCallbackQuery()

    const tr = (await firefly(userId).Transactions.getTransaction(trId as any)).data.data

    return ctx.editMessageText(
      formatTransaction(ctx, tr),
      formatTransactionKeyboard(ctx, tr)
    )
  } catch (err) {
    log('Error: %O', err)
    console.error('Error occured cancelling edit transaction: ', err)
    throw err
  }
}

async function changeTransactionAmountCbQH(ctx: F3Context) {
  const log = rootLog.extend('changeTransactionAmount')
  log('Entered changeTransactionAmount action handler')
  try {
    const trId = ctx.match![1]

    await ctx.answerCallbackQuery()

    ctx.session.step = Route.CHANGE_AMOUNT

    return ctx.editMessageText(ctx.i18n.t('transactions.edit.typeNewAmount'), {
      reply_markup: new InlineKeyboard()
        .text(ctx.i18n.t('labels.CANCEL'), mapper.editMenu.template({ trId }))
    })
  } catch (err) {
    console.error(err)
  }
}

async function changeTransactionDescriptionCbQH(ctx: F3Context) {
  const log = rootLog.extend('changeTransactionDescription')
  log('Entered changeTransactionDescription action handler')
  try {
    const trId = ctx.match![1]

    await ctx.answerCallbackQuery()

    ctx.session.step = Route.CHANGE_DESCRIPTION

    return ctx.editMessageText(ctx.i18n.t('transactions.edit.typeNewDescription'), {
      reply_markup: new InlineKeyboard()
        .text(ctx.i18n.t('labels.CANCEL'), mapper.editMenu.template({ trId }))
    })
  } catch (err) {
    console.error(err)
  }
}

async function changeAmountRouteHandler(ctx: F3Context) {
  const log = rootLog.extend('changeAmountRouteHandler')
  log('Entered change amount route handler')
  try {
    const userId = ctx.from!.id
    log('ctx.session: %O', ctx.session)
    const text = ctx.msg?.text || ''
    const amount = parseAmountInput(text)
    log('amount: %O', amount)

    const trId = ctx.session.editTransaction.id || ''

    if (!amount) {
      return ctx.editMessageText(ctx.i18n.t('transactions.edit.badAmountTyped'), {
        reply_markup: new InlineKeyboard()
          .text(ctx.i18n.t('labels.CANCEL'), mapper.editMenu.template({ trId }))
      })
    }

    ctx.session.step = 'IDLE'

    if (ctx.session.deleteBotsMessage) {
      log('Deleting original message')
      await ctx.session.deleteBotsMessage()
    }

    const tr = (await firefly(userId).Transactions.updateTransaction(
      trId,
      { transactions: [{ amount: amount.toString() }] }
    )).data.data

    return ctx.reply(
      formatTransaction(ctx, tr),
      formatTransactionKeyboard(ctx, tr)
    )
  } catch (err) {
    console.error(err)
  }
}

async function changeDescriptionRouteHandler(ctx: F3Context) {
  const log = rootLog.extend('changeDescriptionRouteHandler')
  log('Entered change description route handler')
  try {
    const userId = ctx.from!.id
    log('ctx.session: %O', ctx.session)
    const description = ctx.msg?.text || ''
    log('description: %O', description)

    const trId = ctx.session.editTransaction.id || ''

    if (!description) {
      return ctx.editMessageText(ctx.i18n.t('transactions.edit.badDescriptionTyped'), {
        reply_markup: new InlineKeyboard()
          .text(ctx.i18n.t('labels.CANCEL'), mapper.editMenu.template({ trId }))
      })
    }

    ctx.session.step = 'IDLE'

    if (ctx.session.deleteBotsMessage) {
      log('Deleting original message')
      await ctx.session.deleteBotsMessage()
    }

    const tr = (await firefly(userId).Transactions.updateTransaction(
      trId,
      { transactions: [{ description: description.trim() }] }
    )).data.data

    return ctx.reply(
      formatTransaction(ctx, tr),
      formatTransactionKeyboard(ctx, tr)
    )
  } catch (err) {
    console.error(err)
  }
}

async function selectNewCategory(ctx: F3Context) {
  const log = rootLog.extend('selectNewCategory')
  log('Entered selectNewCategory action handler')
  try {
    const userId = ctx.from!.id
    const trId = ctx.match![1]

    await ctx.answerCallbackQuery()

    const categoriesKeyboard = await createCategoriesKeyboard(
      userId,
      mapper.setCategory
    )
    categoriesKeyboard
      .text(ctx.i18n.t('labels.CANCEL'), mapper.editMenu.template({ trId }))

    return ctx.editMessageText(ctx.i18n.t('transactions.edit.chooseNewCategory'), {
      reply_markup: categoriesKeyboard
    })

  } catch (err) {
    console.error(err)
  }
}

async function selectNewAssetAccount(ctx: F3Context) {
  const log = rootLog.extend('selectNewAssetAccount')
  log('Entered selectNewAssetAccount action handler')
  try {
    const userId = ctx.from!.id
    const trId = ctx.match![1]

    await ctx.answerCallbackQuery()

    const accountsKeyboard = await createAccountsKeyboard(
      userId,
      AccountTypeFilter.Asset,
      mapper.setAssetAccount
    )

    accountsKeyboard
      .text(ctx.i18n.t('labels.CANCEL'), mapper.editMenu.template({ trId }))

    log('accountsKeyboard: %O', accountsKeyboard.inline_keyboard)

    return ctx.editMessageText(ctx.i18n.t('transactions.edit.chooseNewAssetAccount'), {
      reply_markup: accountsKeyboard
    })

  } catch (err) {
    console.error(err)
  }
}

async function selectNewDepositAssetAccount(ctx: F3Context) {
  const log = rootLog.extend('selectNewDepositAssetAccount')
  log('Entered selectNewDepositAssetAccount action handler')
  try {
    const userId = ctx.from!.id
    const trId = ctx.match![1]

    await ctx.answerCallbackQuery()

    const accountsKeyboard = await createAccountsKeyboard(
      userId,
      AccountTypeFilter.Asset,
      mapper.setDepositAssetAccount
    )

    accountsKeyboard
      .text(ctx.i18n.t('labels.CANCEL'), mapper.editMenu.template({ trId }))

    log('accountsKeyboard: %O', accountsKeyboard.inline_keyboard)

    return ctx.editMessageText(ctx.i18n.t('transactions.edit.chooseNewAssetAccount'), {
      reply_markup: accountsKeyboard
    })

  } catch (err) {
    console.error(err)
  }
}

async function selectNewExpenseAccount(ctx: F3Context) {
  const log = rootLog.extend('selectNewExpenseAccount')
  log('Entered selectNewExpenseAccount action handler')
  try {
    const userId = ctx.from!.id
    const trId = ctx.match![1]

    await ctx.answerCallbackQuery()

    const accountsKeyboard = await createExpenseAccountsKeyboard(userId)
    accountsKeyboard
      .text(ctx.i18n.t('labels.CANCEL'), mapper.editMenu.template({ trId }))

    return ctx.editMessageText(ctx.i18n.t('transactions.edit.chooseNewExpenseAccount'), {
      reply_markup: accountsKeyboard
    })

  } catch (err) {
    console.error(err)
  }
}

async function selectNewRevenueAccount(ctx: F3Context) {
  const log = rootLog.extend('selectNewRevenueAccount')
  log('Entered selectNewRevenueAccount action handler')
  try {
    const userId = ctx.from!.id
    const trId = ctx.match![1]

    await ctx.answerCallbackQuery()

    const accountsKeyboard = await createAccountsKeyboard(
      userId,
      AccountTypeFilter.Revenue,
      mapper.setRevenueAccount
    )
    accountsKeyboard
      .text(ctx.i18n.t('labels.CANCEL'), mapper.editMenu.template({ trId }))

    return ctx.editMessageText(ctx.i18n.t('transactions.edit.chooseNewRevenueAccount'), {
      reply_markup: accountsKeyboard
    })

  } catch (err) {
    console.error(err)
  }
}

async function setNewCategory(ctx: F3Context) {
  const log = rootLog.extend('setNewCategory')
  log('Entered editTransactionCategory action handler')
  try {
    const userId = ctx.from!.id
    const categoryId = ctx.match![1]
    log('categoryId: %O', categoryId)

    await ctx.answerCallbackQuery()

    const trId = ctx.session.editTransaction.id || ''
    log('trId: %O', trId)
    const tr = (await firefly(userId).Transactions.updateTransaction(
      trId,
      { transactions: [{ category_id: categoryId }]}
    )).data.data

    return ctx.editMessageText(
      formatTransaction(ctx, tr),
      formatTransactionKeyboard(ctx, tr)
    )

  } catch (err) {
    console.error(err)
  }
}

async function setNewAssetAccount(ctx: F3Context) {
  const log = rootLog.extend('setNewAssetAccount')
  log('Entered setNewAssetAccount action handler')
  try {
    const userId = ctx.from!.id
    const sourceId = ctx.match![1]
    log('sourceId: %O', sourceId)

    await ctx.answerCallbackQuery()

    const trId = ctx.session.editTransaction.id || ''
    log('trId: %O', trId)
    const tr = (await firefly(userId).Transactions.updateTransaction(
      trId,
      { transactions: [{ source_id: sourceId }]}
    )).data.data

    return ctx.editMessageText(
      formatTransaction(ctx, tr),
      formatTransactionKeyboard(ctx, tr)
    )

  } catch (err) {
    console.error(err)
  }
}

async function setNewExpenseAccount(ctx: F3Context) {
  const log = rootLog.extend('setNewExpenseAccount')
  log('Entered setNewExpenseAccount action handler')
  try {
    const userId = ctx.from!.id
    const destId = ctx.match![1]
    log('destId: %O', destId)

    await ctx.answerCallbackQuery()

    const trId = ctx.session.editTransaction.id || ''
    log('trId: %O', trId)
    const tr = (await firefly(userId).Transactions.updateTransaction(
      trId,
      { transactions: [{ destination_id: destId }]}
    )).data.data

    return ctx.editMessageText(
      formatTransaction(ctx, tr),
      formatTransactionKeyboard(ctx, tr)
    )

  } catch (err) {
    console.error(err)
  }
}

async function setNewRevenueAccount(ctx: F3Context) {
  const log = rootLog.extend('setNewRevenueAccount')
  log('Entered setNewRevenueAccount action handler')
  try {
    const userId = ctx.from!.id
    const sourceId = ctx.match![1]
    log('destId: %O', sourceId)

    await ctx.answerCallbackQuery()

    const trId = ctx.session.editTransaction.id || ''
    log('trId: %O', trId)
    const tr = (await firefly(userId).Transactions.updateTransaction(
      trId,
      { transactions: [{ source_id: sourceId }]}
    )).data.data

    return ctx.editMessageText(
      formatTransaction(ctx, tr),
      formatTransactionKeyboard(ctx, tr)
    )
  } catch (err) {
    console.error(err)
  }
}

async function setNewDepositAssetAccount(ctx: F3Context) {
  const log = rootLog.extend('setNewDepositAssetAccount')
  log('Entered setNewDepositAssetAccount action handler')
  try {
    const userId = ctx.from!.id
    const destinationId = ctx.match![1]
    log('destId: %O', destinationId)

    await ctx.answerCallbackQuery()

    const trId = ctx.session.editTransaction.id || ''
    log('trId: %O', trId)
    const tr = (await firefly(userId).Transactions.updateTransaction(
      trId,
      { transactions: [{ destination_id: destinationId }]}
    )).data.data

    return ctx.editMessageText(
      formatTransaction(ctx, tr),
      formatTransactionKeyboard(ctx, tr)
    )
  } catch (err) {
    console.error(err)
  }
}
