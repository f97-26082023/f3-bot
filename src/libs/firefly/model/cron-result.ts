/* tslint:disable */
/* eslint-disable */
/**
 * Firefly III API v1.5.6
 * This is the documentation of the Firefly III API. You can find accompanying documentation on the website of Firefly III itself (see below). Please report any bugs or issues. You may use the \"Authorize\" button to try the API below. This file was last generated on 2022-04-04T03:54:41+00:00 
 *
 * The version of the OpenAPI document: 1.5.6
 * Contact: james@firefly-iii.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { CronResultRow } from './cron-result-row';

/**
 * 
 * @export
 * @interface CronResult
 */
export interface CronResult {
    /**
     * 
     * @type {CronResultRow}
     * @memberof CronResult
     */
    recurring_transactions?: CronResultRow;
    /**
     * 
     * @type {CronResultRow}
     * @memberof CronResult
     */
    auto_budgets?: CronResultRow;
    /**
     * 
     * @type {CronResultRow}
     * @memberof CronResult
     */
    telemetry?: CronResultRow;
}

