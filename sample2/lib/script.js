//////////////////////////////////////////////////////////////////////
/**
 * @param {test.io.MakeOrder} tx
 * @transaction
 */
async function onMakeOrder(tx) {
    
    const ar = await getAssetRegistry('test.io.Order');

    var q = buildQuery('SELECT test.io.Order WHERE (status == _$input)');

    var orders = await query(q, {input: 'NEW'});

    if (orders.length > 0) {
        throw new Error("User already has open orders")
    }

    const factory = getFactory();

    var newOrder = factory.newResource("test.io", "Order", tx.id);
    newOrder.status = 'NEW'
    newOrder.company = tx.company;
    
    const pr = await getParticipantRegistry('test.io.User');
    
    newOrder.user = factory.newRelationship("test.io", "User", getCurrentParticipant().getIdentifier());


    await ar.add(newOrder);  
}

//////////////////////////////////////////////////////////////////////
/**
 * @param {test.io.ExecuteOrder} tx
 * @transaction
 */
async function onExecuteOrder(tx) {

    const ar = await getAssetRegistry('test.io.Order')
    const order = await ar.get(tx.orderId)

    if (order.status != 'NEW') {
        throw new Error("Invalid order status. Must ne NEW")
    }

    order.status = 'EXECUTED'

    await ar.update(order)
}