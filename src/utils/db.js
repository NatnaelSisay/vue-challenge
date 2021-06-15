/* eslint-disable no-unused-vars */
/**
 * Retrive and save data to indexDB
 * 
 */
const DB_NAME = 'INPUT_FIELD'
const DB_VERSION = 3
const STORE_NAME = 'INPUT_STORE'

let dataBase = null

export const create_db = () => {
  const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
  const request = indexedDB.open( DB_NAME, DB_VERSION )

  return new Promise( ( resolve, reject ) => {
    request.onerror = ( event ) => {
      console.log( "Error creating DB.", event )
      reject( event )
    }

    request.onupgradeneeded = ( event ) => {
      dataBase = event.target.result

      const store = dataBase.createObjectStore( STORE_NAME, { keyPath: "id" } )

      store.transaction.oncomplete = ( event ) => {
        console.log( "store successfully completed" )
      }
      resolve( dataBase )
    }

    request.onsuccess = ( event ) => {
      dataBase = event.target.result
      resolve( dataBase )
    }
  } )

}

export const delete_db = () => {
  const result = window.indexedDB.deleteDatabase( DB_NAME )

  result.onsuccess = ( event ) => {
    console.log( "DB successfully deleted", event )
  }
}

export const addTodDB = ( userInput ) => {
  if ( !dataBase ) return null

  const value = { id: 'result', 'value': userInput }

  const field_transaction = dataBase.transaction( STORE_NAME, "readwrite" )
  const store = field_transaction.objectStore( STORE_NAME )

  let result = null

  store.get( 'result' ).onsuccess = ( event ) => {
    /**
     * If we already have data, update
     * else create new data
     */
    if ( event.target.result ) {
      const newvalue = event.target.result
      newvalue.value = userInput

      result = store.put( newvalue )

    } else {
      result = store.add( value )
    }

    result.onerror = ( event ) => {
      console.log( 'Error while adding input field ', event )
    }

    result.onsuccess = ( event ) => {
      console.log( "Adding was successfull", event )
    }
  }
}

export const getData = async () => {
  if ( !dataBase ) return null

  const field_transaction = dataBase.transaction( STORE_NAME, "readonly" )
  const store = await field_transaction.objectStore( STORE_NAME )

  const result = store.get( "result" )

  return new Promise( ( resolve, reject ) => {
    result.onsuccess = ( event ) => {
      if ( event.target.result ) {
        resolve( event.target.result.value )
      } else {
        reject( "No data" )
      }
    }
    result.onerror = ( event ) => {
      reject( "No data" )
    }
  } )

}