import moment from 'moment'
import Debug from 'debug'
import { Composer } from 'grammy'
import { table, getBorderCharacters } from 'table'
import type { Alignment } from 'table'

import type { F3Context } from '../types/F3Context'
import i18n from '../libs/i18n'
import {
  listAccountsMapper as mapper,
  createAccountsMenuKeyboard,
  convertNumberToCurrency
} from './helpers'

import firefly from '../libs/firefly'
import { AccountTypeFilter } from '../libs/firefly/model/account-type-filter'
import { AccountRead } from '../libs/firefly/model/account-read'
import { ShortAccountTypeProperty } from '../libs/firefly/model'
import { getUserStorage } from '../libs/storage'

const debug = Debug(`bot:accounts`)

const bot = new Composer<F3Context>()

// List transactions
bot.hears(i18n.t('en', 'labels.ACCOUNTS'), showAccounts)
bot.hears(i18n.t('vi', 'labels.ACCOUNTS'), showAccounts)
bot.callbackQuery(mapper.list.regex(), showAccounts)
bot.callbackQuery(mapper.close.regex(), closeHandler)

export default bot

async function showAccounts(ctx: F3Context) {
  const log = debug.extend('showAccounts')
  log(`Entered showAccounts callback handler...`)
  try {
    log('ctx: %O', ctx)
    const userId = ctx.from!.id
    const isRegularMessage = !!ctx.update.message
    log('isRegularMessage: %O', isRegularMessage)
    log('ctx.match: %O', ctx.match)

    const page = 1
    let accType: ShortAccountTypeProperty | AccountTypeFilter
    const balanceToDate = moment().format('YYYY-MM-DD')

    // Check if it is a callback query handler massage or a regular one
    if (isRegularMessage) {
      accType = ShortAccountTypeProperty.Asset // by default use Asset account type
    } else {
      await ctx.answerCallbackQuery()
      accType = ctx.match![1] as AccountTypeFilter
    }
    log('accType: %O', accType)

    const accounts = (await firefly(userId).Accounts.listAccount(
      page, balanceToDate, accType as AccountTypeFilter)).data.data
    log('accounts: %O', accounts)

    const keyboard = createAccountsMenuKeyboard(ctx, accType as ShortAccountTypeProperty)
    const text = formatAccountsMessage(ctx, accType as ShortAccountTypeProperty, accounts)

    if (isRegularMessage) {
      return ctx.reply(text, {
        parse_mode: 'HTML',
        reply_markup: keyboard
      })
    } else {
      return ctx.editMessageText(text, {
        parse_mode: 'HTML',
        reply_markup: keyboard
      })
    }
  } catch (err) {
    console.error(err)
  }
}

async function closeHandler(ctx: F3Context) {
  const log = debug.extend('closeHandler')
  log('ctx.session: %O', ctx.session)
  await ctx.answerCallbackQuery()
  ctx.session.deleteKeyboardMenuMessage &&
    await ctx.session.deleteKeyboardMenuMessage()
  return ctx.deleteMessage()
}

// Assumed that accounts is a list of only one particular account type
function formatAccountsMessage(
  ctx: F3Context, accType: ShortAccountTypeProperty, accounts: AccountRead[]
) {
  const log = debug.extend('formatAccountsMessage')
  const sumsObject = accounts.reduce((res, acc) => {
    const currency = acc.attributes.currency_symbol || '💲'
    log('currency: %O', currency)
    if (!res[currency]) {
      res[currency] = +parseFloat(acc.attributes.current_balance || '')
    } else {
      res[currency] += parseFloat(acc.attributes.current_balance || '')
    }
    res[currency] = Math.ceil(res[currency])
    log('res[currency]: %O', res[currency])
    return res
  }, {} as { [key: string]: number })
  log('sumsObject: %O', sumsObject)
  const { language } = getUserStorage(ctx.from!.id)
  const sums = Object.entries(sumsObject).map(entry => {
    const [currency, sum] = entry
    return `${convertNumberToCurrency(sum, language)} ${currency}`
  }).join('\n       ').replace(/\n$/, '')

  return ctx.i18n.t(`accounts.list.${accType}`, {
    sums,
    accounts: formatAccounts(ctx, accounts),
  })
}

function formatAccounts(ctx: F3Context, accounts: AccountRead[]) {
  const log = debug.extend('formatAccounts')
  if (accounts.length === 0) return ctx.i18n.t('accounts.list.noAccounts')
  const { language } = getUserStorage(ctx.from!.id)
  const data = [
    ...accounts.map(acc => {
      const balance = convertNumberToCurrency(parseFloat(acc.attributes.current_balance || '').toFixed(acc.attributes.currency_decimal_places), language)
      const currency = acc.attributes.currency_symbol
      const name = acc.attributes.name
      return [ name, balance, currency ]
    })
  ]

  const config = {
    border: getBorderCharacters('void'),
    columnDefault: {
        paddingLeft: 0,
        paddingRight: 0
    },
    drawHorizontalLine: () => false,
    columns: [
      { alignment: 'left' as Alignment },
      { alignment: 'right' as Alignment },
      { paddingLeft: 0, alignment: 'left' as Alignment }
    ]
  }

  log(table(data, config))
  return table(data, config)
}
