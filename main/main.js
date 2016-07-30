'use strict';

let _ = require('lodash');

function getElementByBarcode(array,barcode){
  return array.find((element) => element.barcode === barcode);
}

function getFormatedTags(tags) {
  return tags.map((tag) => {
    if(tag.includes('-')){
      let [barcode,count] = tag.split('-');
      return {
        barcode,
        count:parseFloat(count)
      }
    }else{
      return{
        barcode:tag,
        count:1
      }
    }
  });
}

function countBarcodes(formatedTags) {
  return formatedTags.reduce((result, formatedTag) => {
    let found = getElementByBarcode(result, formatedTag.barcode);
    if (found) {
      found.count += formatedTag.count;
    } else {
      result.push(formatedTag);
    }
    return result;
  },[]);
}

function buildCartItems(countBarcodes,allItems){
  return countBarcodes.map((countBarcode) => {
    let found = getElementByBarcode(allItems,countBarcode.barcode);
    return {
      barcode:found.barcode,
      name:found.name,
      unit:found.unit,
      price:found.price,
      count:countBarcode.count
    }
  })
}

function getPromotedCartInfo(cartItems,promotions) {
  let currentPromotion = promotions[0];
  let hasPromoted = false;

  return cartItems.map((cartItem) => {
      if(currentPromotion.barcodes.includes(cartItem.barcode)){
        hasPromoted = true;
        let savdCount = Math.floor(cartItem.count / 3);
        var saved = cartItem.price * savdCount;
      }else{
        var saved = 0;
      }
    return {
      barcode:cartItem.barcode,
      name:cartItem.name,
      unit:cartItem.unit,
      price:cartItem.price,
      count:cartItem.count,
      saved:saved
    }
  })

}

module.exports = {
  getFormatedTags,
  countBarcodes,
  buildCartItems,
  getPromotedCartInfo
}

