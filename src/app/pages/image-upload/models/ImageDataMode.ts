
export interface ImageDataModel {
    id: number
    image_name: string
    image_url: string
    title: string
    description: string | undefined
    tags: string
    user_auth_id: string
    user_id: string
    upload_completed: boolean
    created_date: Date
    updated_date: Date
  }
  