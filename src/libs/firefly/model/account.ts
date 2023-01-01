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
import { LiabilityDirection } from './liability-direction';
// May contain unused imports in some cases
// @ts-ignore
import { LiabilityType } from './liability-type';
// May contain unused imports in some cases
// @ts-ignore
import { ShortAccountTypeProperty } from './short-account-type-property';

/**
 * 
 * @export
 * @interface Account
 */
export interface Account {
    /**
     * 
     * @type {string}
     * @memberof Account
     */
    'created_at'?: string;
    /**
     * 
     * @type {string}
     * @memberof Account
     */
    'updated_at'?: string;
    /**
     * If omitted, defaults to true.
     * @type {boolean}
     * @memberof Account
     */
    'active'?: boolean;
    /**
     * Order of the account. Is NULL if account is not asset or liability.
     * @type {number}
     * @memberof Account
     */
    'order'?: number | null;
    /**
     * 
     * @type {string}
     * @memberof Account
     */
    'name': string;
    /**
     * 
     * @type {ShortAccountTypeProperty}
     * @memberof Account
     */
    'type': ShortAccountTypeProperty;
    /**
     * 
     * @type {AccountRoleProperty}
     * @memberof Account
     */
    'account_role'?: AccountRoleProperty | null;
    /**
     * Use either currency_id or currency_code. Defaults to the user\'s default currency.
     * @type {string}
     * @memberof Account
     */
    'currency_id'?: string;
    /**
     * Use either currency_id or currency_code. Defaults to the user\'s default currency.
     * @type {string}
     * @memberof Account
     */
    'currency_code'?: string;
    /**
     * 
     * @type {string}
     * @memberof Account
     */
    'currency_symbol'?: string;
    /**
     * 
     * @type {number}
     * @memberof Account
     */
    'currency_decimal_places'?: number;
    /**
     * 
     * @type {string}
     * @memberof Account
     */
    'current_balance'?: string;
    /**
     * 
     * @type {string}
     * @memberof Account
     */
    'current_balance_date'?: string;
    /**
     * 
     * @type {string}
     * @memberof Account
     */
    'iban'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Account
     */
    'bic'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Account
     */
    'account_number'?: string | null;
    /**
     * Represents the opening balance, the initial amount this account holds.
     * @type {string}
     * @memberof Account
     */
    'opening_balance'?: string;
    /**
     * Represents the current debt for liabilities.
     * @type {string}
     * @memberof Account
     */
    'current_debt'?: string | null;
    /**
     * Represents the date of the opening balance.
     * @type {string}
     * @memberof Account
     */
    'opening_balance_date'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Account
     */
    'virtual_balance'?: string;
    /**
     * If omitted, defaults to true.
     * @type {boolean}
     * @memberof Account
     */
    'include_net_worth'?: boolean;
    /**
     * 
     * @type {CreditCardType}
     * @memberof Account
     */
    'credit_card_type'?: CreditCardType | null;
    /**
     * Mandatory when the account_role is ccAsset. Moment at which CC payment installments are asked for by the bank.
     * @type {string}
     * @memberof Account
     */
    'monthly_payment_date'?: string | null;
    /**
     * 
     * @type {LiabilityType}
     * @memberof Account
     */
    'liability_type'?: LiabilityType | null;
    /**
     * 
     * @type {LiabilityDirection}
     * @memberof Account
     */
    'liability_direction'?: LiabilityDirection | null;
    /**
     * Mandatory when type is liability. Interest percentage.
     * @type {string}
     * @memberof Account
     */
    'interest'?: string | null;
    /**
     * 
     * @type {LiabilityDirection}
     * @memberof Account
     */
    'interest_period'?: LiabilityDirection | null;
    /**
     * 
     * @type {string}
     * @memberof Account
     */
    'notes'?: string | null;
    /**
     * Latitude of the accounts\'s location, if applicable. Can be used to draw a map.
     * @type {number}
     * @memberof Account
     */
    'latitude'?: number | null;
    /**
     * Latitude of the accounts\'s location, if applicable. Can be used to draw a map.
     * @type {number}
     * @memberof Account
     */
    'longitude'?: number | null;
    /**
     * Zoom level for the map, if drawn. This to set the box right. Unfortunately this is a proprietary value because each map provider has different zoom levels.
     * @type {number}
     * @memberof Account
     */
    'zoom_level'?: number | null;
}

