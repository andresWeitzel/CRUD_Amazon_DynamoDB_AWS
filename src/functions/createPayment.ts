//Models
import {PaymentDetail } from "src/models/PaymentDetail";
import { Payer } from "src/models/Payer";
import { Item } from "src/models/Item";
import { Shipment } from "src/models/Shipment";
//Enums
import { statusCode } from "src/enums/http/statusCode";
//Helpers
import { requestResult } from "src/helpers/http/bodyResponse";
import { validateHeadersAndKeys } from "src/helpers/validations/headers/validateHeadersAndKeys";
import { insertItems } from "src/helpers/dynamodb/operations/insertItems";
import { formatToJson } from "src/helpers/format/formatToJson";
import { generateUuidV4 } from "src/helpers/math/generateUuid";
import { validateObject } from "src/helpers/validations/models/validateObject";


//Const/Vars
let eventBody: any;
let eventBodyItems: any;
let eventBodyPayer: any;
let eventBodyShipment: any;
let eventHeaders: any;
let checkEventHeadersAndKeys: any;
let newItem: Item;
let newPayer: Payer;
let newPayment: PaymentDetail;
let itemDynamoDB: any;
let newPaymentItem: any;
let newShipment:any
let validatePaymentObj: any;
let validateItemObj: any;
let validatePayerObj: any;
let validateShipmentObj:any;
let msg: string;
let code: number;
const PAYMENTS_TABLE_NAME = process.env.DYNAMO_PAYMENTS_TABLE_NAME;




/**
 * @description Add a payment object according to the parameters passed in the request body
 * @param {Object} event Object type
 * @returns the result of the transaction carried out in the database
 */
module.exports.handler = async (event: any) => {
    try {
        //Init
        newPayment = null;
        newPaymentItem = null;


        //-- start with validation headers and keys  ---
        eventHeaders = await event.headers;

        checkEventHeadersAndKeys = await validateHeadersAndKeys(eventHeaders);

        if (checkEventHeadersAndKeys != null) {
            return checkEventHeadersAndKeys;
        }
        //-- end with validation headers and keys  ---



        //-- start with item object operations --

        eventBody = await formatToJson(event.body);


        eventBodyItems = await eventBody.items;

        newItem = new Item(eventBodyItems.id
            , eventBodyItems.title
            , eventBodyItems.description
            , eventBodyItems.picture_url
            , eventBodyItems.category_id
            , eventBodyItems.quantity
            , eventBodyItems.unit_price);

        validateItemObj = await validateObject(newItem);

        if (validateItemObj.length) {
            return await requestResult(
                statusCode.BAD_REQUEST,
                `Bad request, check request attributes for Item Object . Validate the following : ${validateItemObj}`
            );
        }
        //-- end with item object operations --


        //-- start with payer object operations --

        eventBodyPayer = await eventBody.payer;

        newPayer = new Payer(eventBodyPayer.id
            , eventBodyPayer.first_name
            , eventBodyPayer.last_name);

        validatePayerObj = await validateObject(newPayer);

        if (validatePayerObj.length) {
            return await requestResult(
                statusCode.BAD_REQUEST,
                `Bad request, check request attributes for Payer Object . Validate the following : ${validatePayerObj}`
            );
        }

        //-- end with payer object operations --


        //-- start with shipment object operations --

        eventBodyShipment = await eventBody.shipments.receiver_address;


        newShipment = new Shipment(
            await generateUuidV4()
            ,eventBodyShipment.street_number
            , eventBodyShipment.city_name
            , eventBodyShipment.state_name
            , eventBodyShipment.zip_code
            , eventBodyShipment.street_name
        );

        
        validateShipmentObj = await validateObject(newShipment);

        if (validateShipmentObj.length) {
            return await requestResult(
                statusCode.BAD_REQUEST,
                `Bad request, check request attributes for Shipment Object . Validate the following : ${validateShipmentObj}`
            );
        }

        //-- end with shipment object operations --


        //-- start with payment object operations --

        newPayment = new PaymentDetail(
            await generateUuidV4()
            , eventBody.description
            , eventBody.external_reference
            , eventBody.payment_method_id
            , eventBody.token
            , eventBody.transaction_amount
        );

        validatePaymentObj = await validateObject(newPayment);

        if (validatePaymentObj.length) {
            return await requestResult(
                statusCode.BAD_REQUEST,
                `Bad request, check request attributes for Payment Object. Validate the following : ${validatePaymentObj}`
            );
        }
        //-- end with payment object operations --



        //-- start with db operations  ---
        itemDynamoDB = {
            uuid: newPayment.getUuid(),
            description: newPayment.getDescription(),
            externalReference: newPayment.getExternalReference(),
            paymentMethodId: newPayment.getPaymentMethodId(),
            token: newPayment.getToken(),
            transactionAmount: newPayment.getTransactionAmount(),
            //Since it is not defined in the table, the following fields are added at the end
            items: {
                id: newItem.getId(),
                title: newItem.getTitle(),
                description: newItem.getDescription(),
                picture_url: newItem.getPictureUrl(),
                category_id: newItem.getCategoryId(),
                quantity: newItem.getQuantity(),
                unit_price: newItem.getUnitPrice()
            },
            payer: {
                id: newPayer.getId(),
                first_name: newPayer.getFirstName(),
                last_name: newPayer.getLastName()
            },
            shipments: {
                receiver_address:{
                    street_number: newShipment.getStreetNumber(),
                    city_name: newShipment.getCityName(),
                    state_name: newShipment.getStateName(),
                    zip_code: newShipment.getZipCode(),
                    street_name: newShipment.getStateName()
                }
            },
        }

        newPaymentItem = await insertItems(PAYMENTS_TABLE_NAME, itemDynamoDB);

        if (newPaymentItem == null || !(newPaymentItem.length)) {
            return await requestResult(
                statusCode.INTERNAL_SERVER_ERROR,
                "An error has occurred, the object has not been inserted into the database"
            );
        }

        return await requestResult(statusCode.OK, newPaymentItem);

        //-- end with db operations  ---

    } catch (error) {
        code = statusCode.INTERNAL_SERVER_ERROR;
        msg = `Error in CREATE PAYMENT lambda. Caused by ${error}`;
        console.error(`${msg}. Stack error type : ${error.stack}`);

        return await requestResult(code, msg);
    }
};
