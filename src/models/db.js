import lf from 'lovefield'

const VERSION = 1
const schemaBuilder = lf.schema.create('egrid', VERSION)

schemaBuilder.createTable('Project')
  .addColumn('id', lf.Type.STRING)
  .addColumn('name', lf.Type.STRING)
  .addColumn('note', lf.Type.STRING)
  .addColumn('created', lf.Type.DATE_TIME)
  .addColumn('updated', lf.Type.DATE_TIME)
  .addPrimaryKey(['id'])

export const Participant = schemaBuilder.createTable('Participant')
  .addColumn('id', lf.Type.STRING)
  .addColumn('name', lf.Type.STRING)
  .addColumn('note', lf.Type.STRING)
  .addColumn('created', lf.Type.DATE_TIME)
  .addColumn('updated', lf.Type.DATE_TIME)
  .addColumn('projectId', lf.Type.STRING)
  .addPrimaryKey(['id'])

schemaBuilder.createTable('Construct')
  .addColumn('id', lf.Type.STRING)
  .addColumn('text', lf.Type.STRING)
  .addColumn('created', lf.Type.DATE_TIME)
  .addColumn('updated', lf.Type.DATE_TIME)
  .addColumn('projectId', lf.Type.STRING)
  .addPrimaryKey(['id'])

schemaBuilder.createTable('Relation')
  .addColumn('id', lf.Type.STRING)
  .addColumn('text', lf.Type.STRING)
  .addColumn('created', lf.Type.DATE_TIME)
  .addColumn('updated', lf.Type.DATE_TIME)
  .addColumn('participantId', lf.Type.STRING)
  .addColumn('sourceId', lf.Type.STRING)
  .addColumn('targetId', lf.Type.STRING)
  .addPrimaryKey(['id'])

schemaBuilder.createTable('ConstructGroup')
  .addColumn('id', lf.Type.STRING)
  .addColumn('text', lf.Type.STRING)
  .addColumn('created', lf.Type.DATE_TIME)
  .addColumn('updated', lf.Type.DATE_TIME)
  .addColumn('projectId', lf.Type.STRING)
  .addPrimaryKey(['id'])

export const connection = schemaBuilder.connect()
