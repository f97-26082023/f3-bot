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
 * @interface AutocompleteCurrencyCode
 */
export interface AutocompleteCurrencyCode {
    /**
     * 
     * @type {string}
     * @memberof AutocompleteCurrencyCode
     */
    'id': string;
    /**
     * Currency name with the code between brackets.
     * @type {string}
     * @memberof AutocompleteCurrencyCode
     */
    'name': string;
    /**
     * Currency code.
     * @type {string}
     * @memberof AutocompleteCurrencyCode
     */
    'code': string;
    /**
     * 
     * @type {string}
     * @memberof AutocompleteCurrencyCode
     */
    'symbol': string;
    /**
     * 
     * @type {number}
     * @memberof AutocompleteCurrencyCode
     */
    'decimal_places': number;
}

