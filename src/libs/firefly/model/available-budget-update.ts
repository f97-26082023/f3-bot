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
 * @interface AvailableBudgetUpdate
 */
export interface AvailableBudgetUpdate {
    /**
     * Use either currency_id or currency_code.
     * @type {string}
     * @memberof AvailableBudgetUpdate
     */
    'currency_id'?: string;
    /**
     * Use either currency_id or currency_code.
     * @type {string}
     * @memberof AvailableBudgetUpdate
     */
    'currency_code'?: string;
    /**
     * 
     * @type {string}
     * @memberof AvailableBudgetUpdate
     */
    'amount'?: string;
    /**
     * Start date of the available budget.
     * @type {string}
     * @memberof AvailableBudgetUpdate
     */
    'start'?: string;
    /**
     * End date of the available budget.
     * @type {string}
     * @memberof AvailableBudgetUpdate
     */
    'end'?: string;
}

