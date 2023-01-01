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
 * @interface Currency
 */
export interface Currency {
    /**
     * 
     * @type {string}
     * @memberof Currency
     */
    'created_at'?: string;
    /**
     * 
     * @type {string}
     * @memberof Currency
     */
    'updated_at'?: string;
    /**
     * Defaults to true
     * @type {boolean}
     * @memberof Currency
     */
    'enabled'?: boolean;
    /**
     * Make this currency the default currency.
     * @type {boolean}
     * @memberof Currency
     */
    'default'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof Currency
     */
    'code': string;
    /**
     * 
     * @type {string}
     * @memberof Currency
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof Currency
     */
    'symbol': string;
    /**
     * Supports 0-16 decimals.
     * @type {number}
     * @memberof Currency
     */
    'decimal_places'?: number;
}

