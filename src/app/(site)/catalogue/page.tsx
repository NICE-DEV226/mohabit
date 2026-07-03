import { Suspense } from 'react'
import CatalogueContent from './CatalogueContent'

export default function CataloguePage() {
  return (
    <Suspense fallback={
      <div className="pt-28 pb-20 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-16 w-64 bg-grey-mid rounded mb-4" />
            <div className="h-6 w-96 bg-grey-mid rounded mb-12" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-grey-dark rounded-xl h-80" />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <CatalogueContent />
    </Suspense>
  )
}
