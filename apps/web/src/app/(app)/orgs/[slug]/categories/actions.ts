'use server'

import { HTTPError } from 'ky'

import { getCurrentOrganization } from '@/auth/auth'
import { UpsertCategoryFormData } from '@/components/category-form'
import { createCategory } from '@/http/category/create-category'
import { deleteCategory } from '@/http/category/delete-category'
import { getCategories } from '@/http/category/get-categories'
import { updateCategory } from '@/http/category/update-category'
import { ActionResponse } from '@/interfaces/action-response'

export async function createCategoryAction({
  name,
  color,
  type,
}: UpsertCategoryFormData): Promise<ActionResponse> {
  const currentOrganization = await getCurrentOrganization()

  try {
    await createCategory({
      organization: currentOrganization!,
      name,
      color,
      type,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
      }
    }

    return {
      success: false,
      message: 'Internal server error.',
    }
  }

  return {
    success: true,
    message: 'Category created successfully.',
  }
}

export interface GetCategoriesActionProps {
  page: string
  perPage?: string
  name?: string
  type?: string
}

export async function getCategoriesAction({
  page,
  // perPage,
  name,
  type,
}: GetCategoriesActionProps) {
  const currentOrganization = await getCurrentOrganization()

  const { categories, totalCount } = await getCategories({
    organization: currentOrganization!,
    page: page ?? '1',
    // perPage: perPage ?? '10',
    name,
    type,
  })

  return {
    categories,
    totalCount,
  }
}

export async function updateCategoryAction({
  categoryId,
  name,
  color,
  type,
}: UpsertCategoryFormData & { categoryId: string }): Promise<ActionResponse> {
  const currentOrganization = await getCurrentOrganization()

  try {
    await updateCategory({
      organization: currentOrganization!,
      categoryId,
      name,
      color,
      type,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
      }
    }

    return {
      success: false,
      message: 'Internal server error.',
    }
  }

  return {
    success: true,
    message: 'Category updated successfully.',
  }
}

interface DeleteCategoryActionProps {
  categoryId: string
}

export async function deleteCategoryAction({
  categoryId,
}: DeleteCategoryActionProps) {
  const currentOrganization = await getCurrentOrganization()

  await deleteCategory({
    organization: currentOrganization!,
    categoryId,
  })
}
