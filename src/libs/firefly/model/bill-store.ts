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
import { BillRepeatFrequency } from './bill-repeat-frequency';

/**
 * 
 * @export
 * @interface BillStore
 */
export interface BillStore {
    /**
     * Use either currency_id or currency_code
     * @type {string}
     * @memberof BillStore
     */
    'currency_id'?: string;
    /**
     * Use either currency_id or currency_code
     * @type {string}
     * @memberof BillStore
     */
    'currency_code'?: string;
    /**
     * 
     * @type {string}
     * @memberof BillStore
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof BillStore
     */
    'amount_min': string;
    /**
     * 
     * @type {string}
     * @memberof BillStore
     */
    'amount_max': string;
    /**
     * 
     * @type {string}
     * @memberof BillStore
     */
    'date': string;
    /**
     * The date after which this bill is no longer valid or applicable
     * @type {string}
     * @memberof BillStore
     */
    'end_date'?: string;
    /**
     * The date before which the bill must be renewed (or cancelled)
     * @type {string}
     * @memberof BillStore
     */
    'extension_date'?: string;
    /**
     * 
     * @type {BillRepeatFrequency}
     * @memberof BillStore
     */
    'repeat_freq': BillRepeatFrequency;
    /**
     * How often the bill must be skipped. 1 means a bi-monthly bill.
     * @type {number}
     * @memberof BillStore
     */
    'skip'?: number;
    /**
     * If the bill is active.
     * @type {boolean}
     * @memberof BillStore
     */
    'active'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof BillStore
     */
    'notes'?: string | null;
    /**
     * The group ID of the group this object is part of. NULL if no group.
     * @type {string}
     * @memberof BillStore
     */
    'object_group_id'?: string | null;
    /**
     * The name of the group. NULL if no group.
     * @type {string}
     * @memberof BillStore
     */
    'object_group_title'?: string | null;
}

