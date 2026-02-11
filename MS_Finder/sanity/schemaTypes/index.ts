import { type SchemaTypeDefinition } from 'sanity'
import { movie } from './movieTypes'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [movie],
}


export const schemaTypes = [movie]