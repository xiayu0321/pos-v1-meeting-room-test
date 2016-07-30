'use strict';
let main = require('../main/main');
let fixtures = require('./fixtures')
describe('pos', () => {

  it('should print text', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });

  it('should format tags' ,() => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    let formattedTags = main.getFormatedTags(tags);

    let expected = [{
      barcode: 'ITEM000001',
      count:1
    },{
      barcode: 'ITEM000001',
      count:1
    },{
      barcode: 'ITEM000003',
      count:2.5
    },{
      barcode: 'ITEM000005',
      count:1
    },{
      barcode: 'ITEM000005',
      count:2
    }];
    expect(formattedTags).toEqual(expected);
  })


  it('count tags' ,() => {
    const formattedTags = [{
      barcode: 'ITEM000001',
      count:1
    },{
      barcode: 'ITEM000001',
      count:1
    },{
      barcode: 'ITEM000005',
      count:1
    },{
      barcode: 'ITEM000005',
      count:2
    }];

    let countBarcode = main.countBarcodes(formattedTags)

    let expected = [{
      barcode: 'ITEM000001',
      count:2
    },{
      barcode: 'ITEM000005',
      count:3
    }];
    expect(countBarcode).toEqual(expected);
  })

  it('get cart Items' ,() => {
    const countBarcodes = [{
      barcode: 'ITEM000001',
      count:2
    },{
      barcode: 'ITEM000005',
      count:3
    }];
    let allItems = fixtures.loadAllItems();

    let cartItems = main.buildCartItems(countBarcodes,allItems);

    let expected = [    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00,
      count:2
    },{
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50,
      count:3
    }];
    expect( cartItems).toEqual(expected);
  })

  fit('get promoted carts information' ,() => {
    const cartItems = [{
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00,
      count:1
    },{
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50,
      count:3
    }];
    let promotions = fixtures.loadPromotions();

    let promotedCartInfo = main.getPromotedCartInfo(cartItems,promotions);

    let expected = [    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00,
      count:1,
      saved:0
    },{
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50,
      count:3,
      saved:4.50
    }];
    expect(promotedCartInfo).toEqual(expected);
  })
});
