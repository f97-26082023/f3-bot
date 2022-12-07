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
 * @interface BudgetLimit
 */
export interface BudgetLimit {
    /**
     * 
     * @type {string}
     * @memberof BudgetLimit
     */
    created_at?: string;
    /**
     * 
     * @type {string}
     * @memberof BudgetLimit
     */
    updated_at?: string;
    /**
     * Start date of the budget limit.
     * @type {string}
     * @memberof BudgetLimit
     */
    start: string;
    /**
     * End date of the budget limit.
     * @type {string}
     * @memberof BudgetLimit
     */
    end: string;
    /**
     * Use either currency_id or currency_code. Defaults to the user\'s default currency.
     * @type {string}
     * @memberof BudgetLimit
     */
    currency_id?: string;
    /**
     * Use either currency_id or currency_code. Defaults to the user\'s default currency.
     * @type {string}
     * @memberof BudgetLimit
     */
    currency_code?: string;
    /**
     * 
     * @type {string}
     * @memberof BudgetLimit
     */
    currency_name?: string;
    /**
     * 
     * @type {string}
     * @memberof BudgetLimit
     */
    currency_symbol?: string;
    /**
     * 
     * @type {number}
     * @memberof BudgetLimit
     */
    currency_decimal_places?: number;
    /**
     * The budget ID of the associated budget.
     * @type {string}
     * @memberof BudgetLimit
     */
    budget_id: string;
    /**
     * Period of the budget limit. Only used when auto-generated by auto-budget.
     * @type {string}
     * @memberof BudgetLimit
     */
    period?: string | null;
    /**
     * 
     * @type {string}
     * @memberof BudgetLimit
     */
    amount: string;
    /**
     * 
     * @type {string}
     * @memberof BudgetLimit
     */
    spent?: string | null;
}


