import moment from 'moment'
import Debug from 'debug'
import { ParseMode } from '@grammyjs/types'
import { Keyboard, InlineKeyboard } from 'grammy'

import firefly from '../libs/firefly'
import Mapper from '../libs/Mapper'
import type { F3Context } from '../types/F3Context'
import { getUserStorage } from '../libs/storage'
import { TransactionRead } from '../libs/firefly/model/transaction-read'
import { TransactionSplit } from '../libs/firefly/model/transaction-split'
import { AccountTypeFilter } from '../libs/firefly/model/account-type-filter'
import { ShortAccountTypeProperty, TransactionTypeProperty } from '../libs/firefly/model'

const debug = Debug('bot:transactions:helpers')

export {
  createAccountsMenuKeyboard,
  listAccountsMapper,
  listTransactionsMapper,
  addTransactionsMapper,
  editTransactionsMapper,
  reportsMapper,
  parseAmountInput,
  formatTransaction,
  formatTransactionUpdate,
  formatTransactionKeyboard,
  createCategoriesKeyboard,
  createAccountsKeyboard,
  createExpenseAccountsKeyboard,
  createEditMenuKeyboard,
  createMainKeyboard,
  generateWelcomeMessage
}

const listAccountsMapper = {
  list: new Mapper('LIST_ACCOUNTS|TYPE=${type}'),
  close: new Mapper('LIST_ACCOUNTS|DONE'),
}

const listTransactionsMapper = {
  list: new Mapper('LIST_TRANSACTIONS|TYPE=${type}&START=${start}'),
  close: new Mapper('LIST_TRANSACTIONS|DONE'),
}

const addTransactionsMapper = {
  selectCategory: new Mapper('ADD|WITHDRAWAL|CATEGORY_ID=${categoryId}'),
  cancelAdd: new Mapper('ADD|CANCEL'),
  delete: new Mapper('DELETE|TRANSACTION_ID=${trId}'),
  addTransfer: new Mapper('ADD|TRANSFER|AMOUNT=${amount}'),
  addDeposit: new Mapper('ADD|DEPOSIT|AMOUNT=${amount}'),
  selectRevenueAccount: new Mapper('ADD|DEPOSIT|REVENUE_ID=${accountId}'),
  selectAssetAccount: new Mapper('ADD|DEPOSIT|ASSET_ID=${accountId}'),
  selectSourceAccount: new Mapper('ADD|TRANSFER|SOURCE_ID=${accountId}'),
  selectDestAccount: new Mapper('ADD|TRANSFER|DEST_ID=${accountId}')
}

const editTransactionsMapper = {
  editMenu: new Mapper('EDIT_TRANSACTION_ID=${trId}'),
  done: new Mapper('DONE_EDIT_TRANSACTION_ID=${trId}'),
  editDate: new Mapper('CHANGE_TRANSACTION_DATE_ID=${trId}'),
  editAmount: new Mapper('CHANGE_TRANSACTION_AMOUNT_ID=${trId}'),
  editDesc: new Mapper('CHANGE_TRANSACTION_DESCRIPTION_ID=${trId}'),
  editCategory: new Mapper('CHANGE_TRANSACTION_CATEGORY_ID=${trId}'),
  setCategory: new Mapper('SET_TRANSACTION_CATEGORY_ID=${categoryId}'),
  editAssetAccount: new Mapper('CHANGE_TRANSACTION_SOURCE_ID=${trId}'),
  setAssetAccount: new Mapper('SET_TRANSACTION_ASSET_ID=${accountId}'),
  editDepositAssetAccount: new Mapper('CHANGE_DEPOSIT_TRANSACTION_SOURCE_ID=${trId}'),
  setDepositAssetAccount: new Mapper('SET_DEPOSIT_TRANSACTION_ASSET_ID=${accountId}'),
  editExpenseAccount: new Mapper('CHANGE_TRANSACTION_EXPENSE_ID=${trId}'),
  setExpenseAccount: new Mapper('SET_TRANSACTION_EXPENSE_ID=${accountId}'),
  editRevenueAccount: new Mapper('CHANGE_TRANSACTION_REVENUE_ID=${trId}'),
  setRevenueAccount: new Mapper('SET_TRANSACTION_REVENUE_ID=${accountId}'),
  editSourceAccount: new Mapper('CHANGE_SOURCE_ASSET_ACCOUNT_ID=${trId}'),
  setSourceAccount: new Mapper('SET_SOURCE_ASSET_ACCOUNT_ID=${accountId}'),
  editDestinationAccount: new Mapper('CHANGE_DESTINATION_ASSET_ACCOUNT_ID=${trId}'),
  setDestinationAccount: new Mapper('SET_DESTINATION_ASSET_ACCOUNT_ID=${accountId}'),
}

const reportsMapper = {
  lastMonth: new Mapper('REPORTS|LAST_MONTH'),
  thisMonth: new Mapper('REPORTS|THIS_MONTH'),
  yesterday: new Mapper('REPORTS|YESTERDAY'),
  today: new Mapper('REPORTS|TODAY'),
  close: new Mapper('REPORTS|DONE'),
}

function unabbreviateNumber(num: string, symbols = ["", "K", "M", "G", "T", "P", "E"]): number | null {
  const numberPattern = "[+-]?([0-9]*[.])?[0-9]+";
  const symbolPattern = `${symbols.join("|")}`;
  const pattern = `^(${numberPattern})(${symbolPattern})(${numberPattern})?$`;
  const regex = new RegExp(pattern);
  const match = num.match(pattern) || [];

  if (regex.test(num) && match.length > 3) {
    const symbol = match[3];
    const symbolValue =  Math.pow(10, symbols.indexOf(symbol) * 3);
    const pureNum = Number(match[1]);
    const halfNum = match[4] ? Number.parseFloat(`0.${match[4]}`) : 0;
    return pureNum * symbolValue + halfNum * symbolValue;
  } else {
    return null
  }
}

function parseAmountInput(amount: string): number | null {
  return unabbreviateNumber(amount.toUpperCase()) ?? null
}

function formatTransactionKeyboard(ctx: F3Context, tr: TransactionRead) {
  const trSplit = tr.attributes.transactions[0]
  const inlineKeyboard = new InlineKeyboard()
    .text(
      ctx.i18n.t('labels.EDIT_TRANSACTION'),
      editTransactionsMapper.editMenu.template({ trId: trSplit.transaction_journal_id as string })
    )
    .text(
      ctx.i18n.t('labels.DELETE'),
      addTransactionsMapper.delete.template({ trId: trSplit.transaction_journal_id as string })
    )

  return {
    parse_mode: 'Markdown' as ParseMode,
    reply_markup: inlineKeyboard
  }
}

function formatTransaction(ctx: F3Context, tr: Partial<TransactionRead>){
  const trSplit = tr.attributes!.transactions[0]
  const baseProps: any = {
    amount: parseFloat(trSplit.amount),
    source: trSplit.source_name,
    destination: trSplit.destination_name,
    description: trSplit.description,
    currency: trSplit.currency_symbol,
    date: moment(trSplit.date?.slice(0, -6)).format('LLL'),
    trId: tr.id
  }

  let translationString: string
  switch (trSplit.type) {
    case TransactionTypeProperty.Withdrawal:
      translationString = 'transactions.add.withdrawalMessage'
      baseProps.category = trSplit.category_name
      break
    case TransactionTypeProperty.Deposit:
      translationString = 'transactions.add.depositMessage'
      break
    case TransactionTypeProperty.Transfer:
      translationString = 'transactions.add.transferMessage'
      break
    default:
      translationString = '👻 Unexpected transaction type'
  }
  return ctx.i18n.t(translationString, { ...baseProps })
}

async function createCategoriesKeyboard(userId: number, mapper: Mapper) {
  const log = debug.extend('createCategoriesKeyboard')
  try {
    const categories = (await firefly(userId).Categories.listCategory()).data.data
    log('categories: %O', categories)
    const keyboard = new InlineKeyboard()

    for (let i = 0; i < categories.length; i++) {
      const c = categories[i]
      const last = categories.length - 1
      const cbData = mapper.template({ categoryId: c.id })

      keyboard.text(c.attributes.name, cbData)
      // Split categories keyboard into two columns so that every odd indexed
      // category starts from new row as well as the last category in the list.
      if (i % 2 !== 0 || i === last) keyboard.row()
    }

    return keyboard
  } catch (err) {
    log('Error: %O', err)
    console.error('Error occurred creating categories keyboard: ', err)
    throw err
  }
}

async function createAccountsKeyboard(
  userId: number,
  accountType: AccountTypeFilter,
  mapper: Mapper,
  opts?: { skipAccountId: string }
) {
  const log = debug.extend('createAccountKeyboard')
  try {
    let accounts = (await firefly(userId).Accounts.listAccount(
        1, moment().format('YYYY-MM-DD'), accountType)).data.data
    // log('accounts: %O', accounts)
    const keyboard = new InlineKeyboard()

    // Prevent from choosing same account when doing transfers
    if (opts) accounts = accounts.filter(acc => opts.skipAccountId !== acc.id.toString())

    accounts
      .reverse() // we want top accounts be closer to the bottom of the screen
      .forEach((acc, i) => {
        const last = accounts.length - 1
        const cbData = mapper.template({ accountId: acc.id })

        keyboard.text(acc.attributes.name, cbData)
        // Split accounts keyboard into two columns so that every odd indexed
        // account starts from new row as well as the last account in the list.
        if (i % 2 !== 0 || i === last) keyboard.row()
      })

    // log('keyboard.inline_keyboard: %O', keyboard.inline_keyboard)

    return keyboard
  } catch (err) {
    log('Error: %O', err)
    console.error('Error occurred creating acounts keyboard: ', err)
    throw err
  }
}

async function createExpenseAccountsKeyboard(userId: number) {
  const log = debug.extend('createAssetsAccountKeyboard')
  try {
    const accounts = (await firefly(userId).Accounts.listAccount(
        1, moment().format('YYYY-MM-DD'), AccountTypeFilter.Expense)).data.data
    // log('accounts: %O', accounts)
    const keyboard = new InlineKeyboard()

    for (let i = 0; i < accounts.length; i++) {
      const c = accounts[i]
      const last = accounts.length - 1
      const cbData = `SET_TRANSACTION_EXPENSE_ID=${c.id}`

      keyboard.text(c.attributes.name, cbData)
      // Split accounts keyboard into two columns so that every odd indexed
      // account starts from new row as well as the last account in the list.
      if (i % 2 !== 0 || i === last) keyboard.row()
    }

    return keyboard
  } catch (err) {
    log('Error: %O', err)
    console.error('Error occurred creating acounts keyboard: ', err)
    throw err
  }
}

function formatTransactionUpdate(
  ctx: F3Context,
  trRead: Partial<TransactionRead>,
  trSplit: Partial<TransactionSplit>
): string {
  const log = debug.extend('formatTransactionUpdate')
  try {
    log('trRead: %O', trRead)
    log('trSplit: %O', trSplit)
    const oldTransaction = trRead.attributes!.transactions[0]

    const oldAmount = parseFloat(oldTransaction.amount).toString()
    const newAmount = trSplit.amount!.toString()
    const oldCategory = oldTransaction.category_name
    const newCategory = trSplit.category_name
    const oldDescr = oldTransaction.description
    const newDescr = trSplit.description
    const oldDest = oldTransaction.destination_name
    const newDest = trSplit.destination_name
    const oldDate = oldTransaction.date?.slice(0, -6)
    const newDate = trSplit.date?.slice(0, -6)
    let diffPart = '<b>Ваши изменения</b>:'

    if (newCategory && newCategory !== oldCategory)
    diffPart = `<s>${oldCategory}</s> ${newCategory}`

    if (newAmount && newAmount !== oldAmount)
    diffPart = `${diffPart}\nСумма: <s>${oldAmount}</s> <b>${newAmount}</b>`

    if (newDescr && newDescr !== oldDescr)
    diffPart = `${diffPart}\n<s>${oldDescr}</s> <b>${newDescr}</b>`

    if (newDest && newDest !== oldDest)
    diffPart = `${diffPart}\n<s>${oldDest}</s> <b>${newDest}</b>`

    if (newDate && newDate !== oldDate)
    diffPart = `${diffPart}\n<s>${oldDate}</s> <b>${newDate}</b>`

    return `${formatTransaction(ctx, trRead)}\n${diffPart}`

  } catch (err) {
    console.error(err)
    return (err as any).message
  }
}

function createEditWithdrawalTransactionKeyboard(ctx: F3Context, trId: string | number) {
  return new InlineKeyboard()
    .text(ctx.i18n.t('labels.CHANGE_DESCRIPTION'), editTransactionsMapper.editDesc.template({ trId }))
    .text(ctx.i18n.t('labels.CHANGE_CATEGORY'), editTransactionsMapper.editCategory.template({ trId })).row()
    .text(ctx.i18n.t('labels.CHANGE_ASSET_ACCOUNT'), editTransactionsMapper.editAssetAccount.template({ trId }))
    .text(ctx.i18n.t('labels.CHANGE_EXPENSE_ACCOUNT'), editTransactionsMapper.editExpenseAccount.template({ trId })).row()
    .text(ctx.i18n.t('labels.CHANGE_DATE'), editTransactionsMapper.editDate.template({ trId }))
    .text(ctx.i18n.t('labels.CHANGE_AMOUNT'), editTransactionsMapper.editAmount.template({ trId })).row()
    .text(ctx.i18n.t('labels.DONE'), editTransactionsMapper.done.template({ trId })).row()
}

function createEditDepositTransactionKeyboard(ctx: F3Context, trId: string | number) {
  return new InlineKeyboard()
    .text(ctx.i18n.t('labels.CHANGE_DESCRIPTION'), editTransactionsMapper.editDesc.template({ trId })).row()
    .text(ctx.i18n.t('labels.CHANGE_REVENUE_ACCOUNT'), editTransactionsMapper.editRevenueAccount.template({ trId }))
    .text(ctx.i18n.t('labels.CHANGE_ASSET_ACCOUNT'), editTransactionsMapper.editDepositAssetAccount.template({ trId })).row()
    .text(ctx.i18n.t('labels.CHANGE_DATE'), editTransactionsMapper.editDate.template({ trId }))
    .text(ctx.i18n.t('labels.CHANGE_AMOUNT'), editTransactionsMapper.editAmount.template({ trId })).row()
    .text(ctx.i18n.t('labels.DONE'), editTransactionsMapper.done.template({ trId })).row()
}

function createEditTransferTransactionKeyboard(ctx: F3Context, trId: string | number) {
  return new InlineKeyboard()
    .text(ctx.i18n.t('labels.CHANGE_DESCRIPTION'), editTransactionsMapper.editDesc.template({ trId })).row()
    .text(ctx.i18n.t('labels.CHANGE_ASSET_ACCOUNT'), editTransactionsMapper.editSourceAccount.template({ trId }))
    .text(ctx.i18n.t('labels.CHANGE_ASSET_ACCOUNT'), editTransactionsMapper.editDestinationAccount.template({ trId })).row()
    .text(ctx.i18n.t('labels.CHANGE_DATE'), editTransactionsMapper.editDate.template({ trId }))
    .text(ctx.i18n.t('labels.CHANGE_AMOUNT'), editTransactionsMapper.editAmount.template({ trId })).row()
    .text(ctx.i18n.t('labels.DONE'), editTransactionsMapper.done.template({ trId })).row()
}

function createEditMenuKeyboard(ctx: F3Context, tr: TransactionRead) {
  switch (tr.attributes.transactions[0].type) {
    case 'withdrawal':
      return createEditWithdrawalTransactionKeyboard(ctx, tr.id)
    case 'deposit':
      return createEditDepositTransactionKeyboard(ctx, tr.id)
    case 'transfer':
      return createEditTransferTransactionKeyboard(ctx, tr.id)
    default:
      return new InlineKeyboard().text('👻 Unexpected transaction type')
  }
}

function createAccountsMenuKeyboard( ctx: F3Context, accType: ShortAccountTypeProperty) {
  const mapper = listAccountsMapper
  const keyboard = new InlineKeyboard()

  // Dynamically add only relevant transactin type buttons
  switch (accType) {
    case ShortAccountTypeProperty.Asset:
      keyboard
        .text(ctx.i18n.t('accounts.labels.expense'),
          listAccountsMapper.list.template({ type: AccountTypeFilter.Expense })).row()
        .text(ctx.i18n.t('accounts.labels.revenue'),
          mapper.list.template({ type: AccountTypeFilter.Revenue })).row()
        .text(ctx.i18n.t('accounts.labels.liability'),
          mapper.list.template({ type: AccountTypeFilter.Liability })).row()
      break
    case ShortAccountTypeProperty.Expense:
      keyboard
        .text(ctx.i18n.t('accounts.labels.asset'),
          listAccountsMapper.list.template({ type: AccountTypeFilter.Asset })).row()
        .text(ctx.i18n.t('accounts.labels.revenue'),
          mapper.list.template({ type: AccountTypeFilter.Revenue })).row()
        .text(ctx.i18n.t('accounts.labels.liability'),
          mapper.list.template({ type: AccountTypeFilter.Liability })).row()
      break
    case ShortAccountTypeProperty.Revenue:
      keyboard
        .text(ctx.i18n.t('accounts.labels.asset'),
          listAccountsMapper.list.template({ type: AccountTypeFilter.Asset })).row()
        .text(ctx.i18n.t('accounts.labels.expense'),
          mapper.list.template({ type: AccountTypeFilter.Expense })).row()
        .text(ctx.i18n.t('accounts.labels.liability'),
          mapper.list.template({ type: AccountTypeFilter.Liability })).row()
      break
    case ShortAccountTypeProperty.Liability:
      keyboard
        .text(ctx.i18n.t('accounts.labels.asset'),
          listAccountsMapper.list.template({ type: AccountTypeFilter.Asset })).row()
        .text(ctx.i18n.t('accounts.labels.expense'),
          mapper.list.template({ type: AccountTypeFilter.Expense })).row()
        .text(ctx.i18n.t('accounts.labels.revenue'),
          mapper.list.template({ type: AccountTypeFilter.Revenue })).row()
      break
    default:
      keyboard
        .text(ctx.i18n.t('accounts.labels.asset'),
          listAccountsMapper.list.template({ type: AccountTypeFilter.Asset })).row()
        .text(ctx.i18n.t('accounts.labels.expense'),
          mapper.list.template({ type: AccountTypeFilter.Expense })).row()
        .text(ctx.i18n.t('accounts.labels.revenue'),
          mapper.list.template({ type: AccountTypeFilter.Revenue })).row()
        .text(ctx.i18n.t('accounts.labels.liability'),
          mapper.list.template({ type: AccountTypeFilter.Liability })).row()
  }
  keyboard.text(ctx.i18n.t('labels.DONE'), listAccountsMapper.close.template())
  return keyboard
}

function generateWelcomeMessage(ctx: F3Context) {
  const log = debug.extend('generateWelcomeMessage')

  log('start: %O', ctx.message)
  const userId = ctx.from!.id
  const { fireflyUrl, fireflyAccessToken } = getUserStorage(userId)

  let welcomeMessage: string = ctx.i18n.t('welcome')
  const isConfigured = !!(fireflyUrl && fireflyAccessToken)
  log('isConfigured: %O', isConfigured)

  if (!isConfigured) {
    welcomeMessage = welcomeMessage.concat('\n', ctx.i18n.t('needToSet'))
  }
  if (!fireflyUrl) {
    welcomeMessage = welcomeMessage.concat('\n', ctx.i18n.t('setFireflyUrl'))
  }
  if (!fireflyAccessToken) {
    welcomeMessage = welcomeMessage.concat('\n', ctx.i18n.t('setFireflyAccessToken'))
  }
  if (!isConfigured) {
    welcomeMessage = welcomeMessage.concat('\n\n', ctx.i18n.t('navigateToSettings'))
  }

  return welcomeMessage
}

function createMainKeyboard(ctx: F3Context) {
  return new Keyboard()
    .text(ctx.i18n.t('labels.ACCOUNTS'))
    .text(ctx.i18n.t('labels.TRANSACTIONS')).row()
    .text(ctx.i18n.t('labels.REPORTS'))
    .text(ctx.i18n.t('labels.CATEGORIES')).row()
    .text(ctx.i18n.t('labels.SETTINGS'))
}
