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
import { LinkType } from './link-type';
// May contain unused imports in some cases
// @ts-ignore
import { ObjectLink } from './object-link';

/**
 * 
 * @export
 * @interface LinkTypeRead
 */
export interface LinkTypeRead {
    /**
     * Immutable value
     * @type {string}
     * @memberof LinkTypeRead
     */
    'type': string;
    /**
     * 
     * @type {string}
     * @memberof LinkTypeRead
     */
    'id': string;
    /**
     * 
     * @type {LinkType}
     * @memberof LinkTypeRead
     */
    'attributes': LinkType;
    /**
     * 
     * @type {ObjectLink}
     * @memberof LinkTypeRead
     */
    'links': ObjectLink;
}

