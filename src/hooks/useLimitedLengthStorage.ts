import { useState } from 'react'

export enum InsertOrder {
  AFTER = 'AFTER',
  BEFORE = 'BEFORE'
}

interface IAddDataToStorage<T> {
  id: number
  data: T
  insertOrder: InsertOrder
}
interface RIUseLimitedStorage<T> {
  storage: Map<number, T>
  addDataToStorage: (props: IAddDataToStorage<T>) => void
  eraseStorage: () => void
}

export const useLimitedLengthStorage = <T>(lengthLimit: number): RIUseLimitedStorage<T> => {
  const [storage, setStorage] = useState<Map<number, T>>(new Map())

  const addDataToStorage = ({ id, data, insertOrder }: IAddDataToStorage<T>): void => {
    if (storage.size + 1 <= lengthLimit) { storage.set(id, data); setStorage(storage); return }

    const idToRm = insertOrder === InsertOrder.AFTER
      ? id - lengthLimit
      : id + lengthLimit

    storage.delete(idToRm)
    storage.set(id, data)
    setStorage(storage)
  }

  const eraseStorage = (): void => {
    setStorage(new Map())
  }

  return { storage, addDataToStorage, eraseStorage }
}
