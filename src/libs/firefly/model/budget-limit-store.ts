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



/**
 * 
 * @export
 * @interface BudgetLimitStore
 */
export interface BudgetLimitStore {
    /**
     * Use either currency_id or currency_code. Defaults to the user\'s default currency.
     * @type {string}
     * @memberof BudgetLimitStore
     */
    'currency_id'?: string;
    /**
     * Use either currency_id or currency_code. Defaults to the user\'s default currency.
     * @type {string}
     * @memberof BudgetLimitStore
     */
    'currency_code'?: string;
    /**
     * The budget ID of the associated budget.
     * @type {string}
     * @memberof BudgetLimitStore
     */
    'budget_id': string;
    /**
     * Start date of the budget limit.
     * @type {string}
     * @memberof BudgetLimitStore
     */
    'start': string;
    /**
     * Period of the budget limit. Only used when auto-generated by auto-budget.
     * @type {string}
     * @memberof BudgetLimitStore
     */
    'period'?: string | null;
    /**
     * End date of the budget limit.
     * @type {string}
     * @memberof BudgetLimitStore
     */
    'end': string;
    /**
     * 
     * @type {string}
     * @memberof BudgetLimitStore
     */
    'amount': string;
}

