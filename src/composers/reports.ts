import QuickChart from 'quickchart-js';
import Debug from 'debug'
import { Composer, InputFile } from 'grammy'

import firefly from '../lib/firefly'
import type { MyContext } from '../types/MyContext'
import i18n from '../lib/i18n'
import moment from 'moment';

const debug = Debug(`bot:reports`)

const bot = new Composer<MyContext>()

bot.hears(i18n.t('en', 'labels.REPORTS'), showReportCurrentMonth)
bot.hears(i18n.t('vi', 'labels.REPORTS'), showReportCurrentMonth)
bot.hears(i18n.t('ru', 'labels.REPORTS'), showReportCurrentMonth)

async function showReportCurrentMonth(ctx: MyContext) {
  const log = debug.extend('showReportCurrentMonth')
  log(`Entered showReport callback handler...`)
  
  try {
    log('ctx: %O', ctx)
    const userId = ctx.from!.id
    const charts = (await firefly(userId).Charts.getChartAccountOverview(`${moment().year()}-${moment().month() + 1}-01`, `${moment().year()}-${moment().month() + 1}-${moment().date()}`)).data
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

    // return ctx.reply('<b>text</b>', {
    //   parse_mode: 'HTML',
    // })
  } catch (err) {
    console.error(err)
  }
}

export default bot
