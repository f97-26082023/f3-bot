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
import { AttachableType } from './attachable-type';

/**
 * 
 * @export
 * @interface AttachmentStore
 */
export interface AttachmentStore {
    /**
     * 
     * @type {string}
     * @memberof AttachmentStore
     */
    'filename': string;
    /**
     * 
     * @type {AttachableType}
     * @memberof AttachmentStore
     */
    'attachable_type': AttachableType;
    /**
     * ID of the model this attachment is linked to.
     * @type {string}
     * @memberof AttachmentStore
     */
    'attachable_id': string;
    /**
     * 
     * @type {string}
     * @memberof AttachmentStore
     */
    'title'?: string;
    /**
     * 
     * @type {string}
     * @memberof AttachmentStore
     */
    'notes'?: string | null;
}

