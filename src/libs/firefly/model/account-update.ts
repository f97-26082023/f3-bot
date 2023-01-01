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
import { AccountRoleProperty } from './account-role-property';
// May contain unused imports in some cases
// @ts-ignore
import { CreditCardType } from './credit-card-type';
// May contain unused imports in some cases
// @ts-ignore
import { InterestPeriod } from './interest-period';
// May contain unused imports in some cases
// @ts-ignore
import { LiabilityType } from './liability-type';

/**
 * 
 * @export
 * @interface AccountUpdate
 */
export interface AccountUpdate {
    /**
     * 
     * @type {string}
     * @memberof AccountUpdate
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof AccountUpdate
     */
    'iban'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof AccountUpdate
     */
    'bic'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof AccountUpdate
     */
    'account_number'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof AccountUpdate
     */
    'opening_balance'?: string;
    /**
     * 
     * @type {string}
     * @memberof AccountUpdate
     */
    'opening_balance_date'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof AccountUpdate
     */
    'virtual_balance'?: string;
    /**
     * Use either currency_id or currency_code. Defaults to the user\'s default currency.
     * @type {string}
     * @memberof AccountUpdate
     */
    'currency_id'?: string;
    /**
     * Use either currency_id or currency_code. Defaults to the user\'s default currency.
     * @type {string}
     * @memberof AccountUpdate
     */
    'currency_code'?: string;
    /**
     * If omitted, defaults to true.
     * @type {boolean}
     * @memberof AccountUpdate
     */
    'active'?: boolean;
    /**
     * Order of the account
     * @type {number}
     * @memberof AccountUpdate
     */
    'order'?: number;
    /**
     * If omitted, defaults to true.
     * @type {boolean}
     * @memberof AccountUpdate
     */
    'include_net_worth'?: boolean;
    /**
     * 
     * @type {AccountRoleProperty}
     * @memberof AccountUpdate
     */
    'account_role'?: AccountRoleProperty | null;
    /**
     * 
     * @type {CreditCardType}
     * @memberof AccountUpdate
     */
    'credit_card_type'?: CreditCardType | null;
    /**
     * Mandatory when the account_role is ccAsset. Moment at which CC payment installments are asked for by the bank.
     * @type {string}
     * @memberof AccountUpdate
     */
    'monthly_payment_date'?: string | null;
    /**
     * 
     * @type {LiabilityType}
     * @memberof AccountUpdate
     */
    'liability_type'?: LiabilityType | null;
    /**
     * Mandatory when type is liability. Interest percentage.
     * @type {string}
     * @memberof AccountUpdate
     */
    'interest'?: string | null;
    /**
     * 
     * @type {InterestPeriod}
     * @memberof AccountUpdate
     */
    'interest_period'?: InterestPeriod | null;
    /**
     * 
     * @type {string}
     * @memberof AccountUpdate
     */
    'notes'?: string | null;
    /**
     * Latitude of the account\'s location, if applicable. Can be used to draw a map. If omitted, the existing location will be kept. If submitted as NULL, the current location will be removed.
     * @type {number}
     * @memberof AccountUpdate
     */
    'latitude'?: number | null;
    /**
     * Latitude of the account\'s location, if applicable. Can be used to draw a map. If omitted, the existing location will be kept. If submitted as NULL, the current location will be removed.
     * @type {number}
     * @memberof AccountUpdate
     */
    'longitude'?: number | null;
    /**
     * Zoom level for the map, if drawn. This to set the box right. Unfortunately this is a proprietary value because each map provider has different zoom levels. If omitted, the existing location will be kept. If submitted as NULL, the current location will be removed.
     * @type {number}
     * @memberof AccountUpdate
     */
    'zoom_level'?: number | null;
}

