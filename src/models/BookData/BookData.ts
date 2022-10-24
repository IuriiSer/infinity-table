type AuthorName = string[]

export interface BookData {
  key: string
  author_name: AuthorName
  title: string
  type: string
}

export type BooksData = BookData[]
