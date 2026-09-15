import Link from "next/link"
import { createCategoryAction } from "@/app/actions/category-actions"

export const dynamic = "force-dynamic"

export default function NewCategoryPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">New Category</h1>

        <form action={createCategoryAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Biology, Spanish, History..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Create Category
            </button>
            <Link
              href="/"
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
