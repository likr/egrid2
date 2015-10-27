import Dixie from 'dexie'

const db = new Dixie('egrid2');

db.version(1)
  .stores({
    projects: '++id,name,note,evaluationStructure,created,updated',
    participants: '++id,projectId,name,note,created,updated'
  });

db.open();

export default db
