import QuickChart from 'quickchart-js';
import Debug from 'debug'
import moment from 'moment';
import { 
  Composer, 
  InlineKeyboard,
  InputFile 
} from 'grammy'

import firefly from '../libs/firefly'
import type { F3Context } from '../types/F3Context'
import i18n from '../libs/i18n'
import {
  reportsMapper as mapper
} from './helpers'

const debug = Debug(`bot:reports`)

const bot = new Composer<F3Context>()

bot.hears(i18n.t('en', 'labels.REPORTS'), reportsCommandHandler)
bot.hears(i18n.t('vi', 'labels.REPORTS'), reportsCommandHandler)
bot.callbackQuery(mapper.thisMonth.regex(), reportsThisMonth)
bot.callbackQuery(mapper.lastMonth.regex(), reportsLastMonth)
bot.callbackQuery(mapper.close.regex(), closeHandler)

async function closeHandler(ctx: F3Context) {
  const log = debug.extend('closeHandler')
  log('ctx.session: %O', ctx.session)
  await ctx.answerCallbackQuery()
  ctx.session.deleteKeyboardMenuMessage && await ctx.session.deleteKeyboardMenuMessage()
  return await ctx.deleteMessage()
}

function createReportsKeyboard(ctx: F3Context): InlineKeyboard {
  const keyboard = new InlineKeyboard()
    .text(
      ctx.i18n.t('labels.LAST_MONTH'),
      mapper.lastMonth.template()
    )
    .text(
      ctx.i18n.t('labels.THIS_MONTH'),
      mapper.thisMonth.template()
    ).row()

  keyboard.text(ctx.i18n.t('labels.DONE'), mapper.close.template())
  return keyboard
}

async function reportsThisMonth(ctx: F3Context) {
  const log = debug.extend('reportsThisMonth')
  log(`Entered reportsThisMonth callback handler...`)

  try {
    const start = moment().format('YYYY-MM-01')
    const end = moment().format('YYYY-MM-DD')
    log('start: %O', start)
    log('end: %O', end)

    return reportsCharts(ctx, start, end)
  } catch (err) {
    console.error(err)
  }
}

async function reportsLastMonth(ctx: F3Context) {
  const log = debug.extend('reportsLastMonth')
  log(`Entered reportsLastMonth callback handler...`)

  try {
    const start = moment().subtract(1, 'months').startOf("month").format('YYYY-MM-DD')
    const end = moment().subtract(1, 'months').endOf("month").format('YYYY-MM-DD')
    log('start: %O', start)
    log('end: %O', end)
    
    return reportsCharts(ctx, start, end)
  } catch (err) {
    console.error(err)
  }
}

async function reportsCharts(ctx: F3Context, start: string, end: string) {
  const log = debug.extend('reportsToday')
  log(`Entered reportsToday callback handler...`)
  
  try {
    log('ctx: %O', ctx)
    const userId = ctx.from!.id
    const charts = (await firefly(userId).Charts.getChartAccountOverview(start, end)).data
    log('charts: %O', charts)
    
    const labels = charts![0].entries ? Object.keys(charts[0].entries).map((date) => moment(date.slice(0, -6)).format('YYYY-MM-DD')) : []
    const datasets = charts.map((chart) => ({
      label: chart.label,
      data: chart.entries ? Object.values(chart.entries) : []
    }))
    log('labels: %O', labels)
    log('datasets: %O', datasets)

    const chartjs = new QuickChart();
    chartjs.setConfig({
      type: 'line',
      data: { labels, datasets },
    });
    
    await ctx.replyWithPhoto(new InputFile(await chartjs.toBinary()));
    await closeHandler(ctx)
  } catch (err) {
    console.error(err)
  }
}

function reportsCommandHandler(ctx: F3Context) {
  const log = debug.extend('reportsCommandHandler')
  log('Entered the reportsCommandHandler...')
  const keyboard = createReportsKeyboard(ctx)
  const text = ctx.i18n.t(`reports.message`, {
    day: moment().format('LL')
  })

  return ctx.reply(text ,{
      parse_mode: 'HTML',
      reply_markup: keyboard
    }
  )
}

export default bot
