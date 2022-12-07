// import Debug from 'debug'
import { Composer } from 'grammy'

import type { MyContext } from '../types/MyContext'
import i18n from '../lib/i18n'

// const debug = Debug(`bot:reports`)

const bot = new Composer<MyContext>()

bot.hears(i18n.t('en', 'labels.REPORTS'), ctx => ctx.reply('Coming soon...'))
bot.hears(i18n.t('vi', 'labels.REPORTS'), ctx => ctx.reply('Coming soon...'))
bot.hears(i18n.t('ru', 'labels.REPORTS'), ctx => ctx.reply('Coming soon...'))

export default bot
