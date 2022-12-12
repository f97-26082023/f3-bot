import debug from 'debug'
import * as dotenv from 'dotenv';
import { Bot, GrammyError, HttpError, session } from 'grammy'

dotenv.config();

import i18n from './libs/i18n'
import config from './config'
import { command } from './libs/constants'
import { requireSettings, cleanup } from './libs/middlewares'
import { createMainKeyboard, generateWelcomeMessage } from './composers/helpers'

import settings from './composers/settings'
import addTransaction, { addTransaction as textHandler } from './composers/transactions/add-transaction'
import editTransaction from './composers/transactions/edit-transaction'
import listTransactions from './composers/transactions/list-transactions'
import accounts from './composers/accounts'
import categories from './composers/categories'
import reports from './composers/reports'

import type { F3Context } from './types/F3Context'
import type { SessionData } from './types/SessionData'

export const Route = {
  idle: 'IDLE'
}

const rootLog = debug(`bot:root`)

const bot = new Bot<F3Context>(config.botToken)

// Attach a session middleware and specify the initial data
bot.use(
  session({
    initial: (): SessionData => ({
      step: 'IDLE',
      newTransaction: { transactions: []},
      editTransaction: {},
      category: {},
      newCategories: [],
    }),
  })
)
bot.use(i18n.middleware());

// Our custom middlewares
bot.use(requireSettings())
bot.use(cleanup())
bot.use(addTransaction)
bot.use(editTransaction)
bot.use(listTransactions)
bot.use(accounts)
bot.use(settings)
bot.use(categories)
bot.use(reports)

bot.command(command.START, startHandler)
bot.command(command.HELP, helpHandler)
bot.on('message:text', textHandler)

bot.start()
bot.catch(errorHandler)

async function startHandler(ctx: F3Context) {
  const log = rootLog.extend('startHandler')
  log('start: %O', ctx.message)

  await setBotCommands(ctx)

  const welcomeMessage = generateWelcomeMessage(ctx)

  return ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      keyboard: createMainKeyboard(ctx).build(),
      resize_keyboard: true
    }
  })
}

function helpHandler(ctx: F3Context) {
  const log = rootLog.extend('helpHandler')
  log('help: %O', ctx.message)

  return ctx.reply(ctx.i18n.t('help'), {
    parse_mode: 'Markdown',
    reply_markup: {
      keyboard: createMainKeyboard(ctx).build(),
      resize_keyboard: true
    }
  })
}

function setBotCommands(ctx: F3Context) {
  const log = rootLog.extend('setBotCommands')
  log('Setting bot commands...')
  const myCommands: {command: string, description: string}[] = []

  for (const val of Object.values(command)) {
    myCommands.push({
      command: val as string,
      description: ctx.i18n.t(`commands.${val}`)
    })
  }
  log('myCommands: %O', myCommands)

  return ctx.api.setMyCommands(myCommands)
}


function errorHandler(err: any) {
  const ctx = err.ctx
  console.error(`Error while handling update ${ctx.update.update_id}:`)
  const e = err.error
  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description)
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e)
  } else {
    console.error('Unknown error:', e)
  }
}
