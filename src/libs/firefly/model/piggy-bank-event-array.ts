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


// May contain unused imports in some cases
// @ts-ignore
import { Meta } from './meta';
// May contain unused imports in some cases
// @ts-ignore
import { PageLink } from './page-link';
// May contain unused imports in some cases
// @ts-ignore
import { PiggyBankEventRead } from './piggy-bank-event-read';

/**
 * 
 * @export
 * @interface PiggyBankEventArray
 */
export interface PiggyBankEventArray {
    /**
     * 
     * @type {Array<PiggyBankEventRead>}
     * @memberof PiggyBankEventArray
     */
    'data': Array<PiggyBankEventRead>;
    /**
     * 
     * @type {Meta}
     * @memberof PiggyBankEventArray
     */
    'meta': Meta;
    /**
     * 
     * @type {PageLink}
     * @memberof PiggyBankEventArray
     */
    'links': PageLink;
}

