//////////////////////////////////////////////////////////////////////
/**
 * @param {org.sample.ProposeTrade} tx
 * @transaction
 */
async function onProposeTrade(tx) {

  // change the movement status of the animal
  tx.animal.movementStatus = 'IN_TRANSIT';

  if (tx.price <= 0) {
    throw new Error("Invalid price");
  }

  // set the proposed price
  tx.animal.proposedPrice = tx.price;

  // get Animals registry
  const ar = await getAssetRegistry('org.sample.Animal');

  // update the Animal in the registry
  await ar.update(tx.animal)
}

//////////////////////////////////////////////////////////////////////
/**
 * @param {org.sample.AcceptTrade} tx
 * @transaction
 */
async function onAcceptTrade(tx) {

  // get farmers registry
  const fr = await getParticipantRegistry('org.sample.Farmer');
  // find the proper farmer in the registry
  const farmer = await fr.get(getCurrentParticipant().getIdentifier());
  // find the animal's owner
  const owner = await fr.get(tx.animal.owner.getIdentifier());

  if (farmer.balance < tx.animal.proposedPrice) {
    throw new Error("Not enough money on your balance");
  }

  // reduce the farmer's balance
  farmer.balance -= tx.animal.proposedPrice;
  // add money to owner's balance
  owner.balance += tx.animal.proposedPrice;
  // change the animal's status
  tx.animal.movementStatus = 'IN_FIELD';
  // change the animal's owner
  tx.animal.owner = farmer;
  // zero the proposed price
  tx.animal.proposedPrice = 0.0;

  // update farmer in the registry
  await fr.update(farmer);
  // update old owner in the registry
  await fr.update(owner);

  // get animals registry
  const ar = await getAssetRegistry('org.sample.Animal');
  // update the animal in the registry
  await ar.update(tx.animal);
}


//////////////////////////////////////////////////////////////////////
/**
 * @param {org.sample.CancelTrade} tx
 * @transaction
 */
async function onCancelTrade(tx) {

  // change the animal's status
  tx.animal.movementStatus = 'IN_FIELD';
  // zero the proposed price
  tx.animal.proposedPrice = 0.0;

  const ar = await getAssetRegistry('org.sample.Animal');
  // update the animal in the registry
  await ar.update(tx.animal);
}


//////////////////////////////////////////////////////////////////////
/**
 * @param {org.sample.SetupDemo} setupDemo
 * @transaction
 */
async function setupDemo(setupDemo) {

  const factory = getFactory();
  const NS = 'org.sample';

  // get registries
  const farmerRegistry = await getParticipantRegistry(NS + '.Farmer');
  const animalRegistry = await getAssetRegistry(NS + '.Animal');

  // create farmers
  var farmers = [
    factory.newResource(NS, 'Farmer', 'farmer1@village.com'),
    factory.newResource(NS, 'Farmer', 'farmer2@village.com'),
    factory.newResource(NS, 'Farmer', 'farmer3@village.com'),
  ];

  // create animals
  var animals = [
    factory.newResource(NS, 'Animal', 'animal1'),
    factory.newResource(NS, 'Animal', 'animal2'),
    factory.newResource(NS, 'Animal', 'animal3'),
    factory.newResource(NS, 'Animal', 'animal4'),
    factory.newResource(NS, 'Animal', 'animal5'),
    factory.newResource(NS, 'Animal', 'animal6'),
    factory.newResource(NS, 'Animal', 'animal7'),
    factory.newResource(NS, 'Animal', 'animal8'),
    factory.newResource(NS, 'Animal', 'animal9'),
  ];

  // fill farmers with basic info
  farmers[0].firstName = 'Bartholomew';
  farmers[0].lastName = 'Carley';
  farmers[0].balance = 100.0;

  farmers[1].firstName = 'Chadwick';
  farmers[1].lastName = 'Cherokee';
  farmers[1].balance = 100.0;

  farmers[2].firstName = 'Franklin';
  farmers[2].lastName = 'Harcourt';
  farmers[2].balance = 100.0;

  // write farmers to the registry
  await farmerRegistry.addAll(farmers);

  // fill animals with basic info
  animals[0].species = 'SHEEP';
  animals[0].name = 'Molly';
  animals[0].colour = 'White';
  animals[0].movementStatus = 'IN_FIELD';
  animals[0].productionType = 'MEAT';
  animals[0].owner = factory.newRelationship(NS, 'Farmer', farmers[0].email);

  animals[1].species = 'CATTLE';
  animals[1].name = 'Dolly';
  animals[1].colour = 'Black';
  animals[1].movementStatus = 'IN_FIELD';
  animals[1].productionType = 'WOOL';
  animals[1].owner = factory.newRelationship(NS, 'Farmer', farmers[1].email);

  animals[2].species = 'SHEEP';
  animals[2].name = 'Larry';
  animals[2].colour = 'Red';
  animals[2].movementStatus = 'IN_FIELD';
  animals[2].productionType = 'DAIRY';
  animals[2].owner = factory.newRelationship(NS, 'Farmer', farmers[2].email);

  animals[3].species = 'CATTLE';
  animals[3].name = 'Sven';
  animals[3].colour = 'Blue';
  animals[3].movementStatus = 'IN_FIELD';
  animals[3].productionType = 'BREEDING';
  animals[3].owner = factory.newRelationship(NS, 'Farmer', farmers[0].email);

  animals[4].species = 'SHEEP';
  animals[4].name = 'Polo';
  animals[4].colour = 'Green';
  animals[4].movementStatus = 'IN_FIELD';
  animals[4].productionType = 'MEAT';
  animals[4].owner = factory.newRelationship(NS, 'Farmer', farmers[1].email);

  animals[5].species = 'SHEEP';
  animals[5].name = 'Priscilla'
  animals[5].colour = 'Red';
  animals[5].movementStatus = 'IN_FIELD';
  animals[5].productionType = 'WOOL';
  animals[5].owner = factory.newRelationship(NS, 'Farmer', farmers[2].email);

  animals[6].species = 'CATTLE';
  animals[6].name = 'Jack';
  animals[6].colour = 'White';
  animals[6].movementStatus = 'IN_FIELD';
  animals[6].productionType = 'BREEDING';
  animals[6].owner = factory.newRelationship(NS, 'Farmer', farmers[0].email);

  animals[7].species = 'PIG';
  animals[7].name = 'Coribda';
  animals[7].colour = 'Blue';
  animals[7].movementStatus = 'IN_FIELD';
  animals[7].productionType = 'DAIRY';
  animals[7].owner = factory.newRelationship(NS, 'Farmer', farmers[1].email);

  animals[8].species = 'SHEEP';
  animals[8].name = 'Mickey';
  animals[8].colour = 'Green';
  animals[8].movementStatus = 'IN_FIELD';
  animals[8].productionType = 'WOOL';
  animals[8].owner = factory.newRelationship(NS, 'Farmer', farmers[2].email);

  // write animals to the registry
  await animalRegistry.addAll(animals);
}