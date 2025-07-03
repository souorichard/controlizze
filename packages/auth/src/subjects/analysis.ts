import z from 'zod'

export const analysisSubject = z.tuple([
  z.union([z.literal('get'), z.literal('export'), z.literal('manage')]),
  z.literal('Analysis'),
])

export type AnalysisSubject = z.infer<typeof analysisSubject>
