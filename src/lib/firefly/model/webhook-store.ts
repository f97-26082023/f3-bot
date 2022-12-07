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


import { WebhookDelivery } from './webhook-delivery';
import { WebhookResponse } from './webhook-response';
import { WebhookTrigger } from './webhook-trigger';

/**
 * 
 * @export
 * @interface WebhookStore
 */
export interface WebhookStore {
    /**
     * Boolean to indicate if the webhook is active
     * @type {boolean}
     * @memberof WebhookStore
     */
    active?: boolean;
    /**
     * A title for the webhook for easy recognition.
     * @type {string}
     * @memberof WebhookStore
     */
    title: string;
    /**
     * 
     * @type {WebhookTrigger}
     * @memberof WebhookStore
     */
    trigger: WebhookTrigger;
    /**
     * 
     * @type {WebhookResponse}
     * @memberof WebhookStore
     */
    response: WebhookResponse;
    /**
     * 
     * @type {WebhookDelivery}
     * @memberof WebhookStore
     */
    delivery: WebhookDelivery;
    /**
     * The URL of the webhook. Has to start with `https`.
     * @type {string}
     * @memberof WebhookStore
     */
    url: string;
}

