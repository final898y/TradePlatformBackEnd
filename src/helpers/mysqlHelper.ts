import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import env from '../configs/env.js';

import * as errorHandling from '../utility/errorHandling.js';

function BuildMysqlStatementSelect(tableName: string): string;
function BuildMysqlStatementSelect(tableName: string, filterField?: string[]): string;

function BuildMysqlStatementSelect(tableName: string, filterField?: string[]): string {
  const baseStatement = `SELECT * FROM ${tableName}`;
  if (filterField === undefined) {
    return baseStatement;
  }
  if (filterField.length === 1) {
    return baseStatement + ' WHERE ' + filterField[0] + ' = ?';
  }
  const filterStatement = filterField.join(' = ? AND ');
  return baseStatement + ' WHERE ' + filterStatement + ' = ?';
}

function BuildMysqlStatementInsert(tableName: string, filterField?: string[]): string {
  const baseStatement = `INSERT INTO ${tableName} (`;
  if (filterField === undefined) {
    return baseStatement.slice(0, -1);
  }
  if (filterField.length === 1) {
    return baseStatement + filterField[0] + ') VALUES (?)';
  }
  const filterStatement = filterField.join(', ');
  const questionMarkArray = Array(filterField.length).fill('?');
  const questionMarkString = questionMarkArray.join(', ');
  return baseStatement + filterStatement + ') VALUES (' + questionMarkString + ')';
}

function BuildMysqlStatementUpdate(
  tableName: string,
  updateField: string[],
  filterField: string,
): string {
  const baseStatement = `UPDATE ${tableName} SET `;
  if (updateField.length === 1) {
    return baseStatement + updateField[0] + '= ? WHERE ' + filterField + '= ?';
  } else {
    const updateStatement = updateField.join('= ?, ');
    return baseStatement + updateStatement + '= ? ' + 'WHERE ' + filterField + '= ?';
  }
}

// INSERT INTO your_table (column1, column2, ...)
// SELECT value1, value2, ...
// FROM DUAL
// WHERE NOT EXISTS (SELECT 1 FROM your_table WHERE condition);
// function BuildMysqlStatementInsetAfterSelect(tableName: string, insertField?: string[],filterField?: string[]): string {
//   const baseStatement = `INSERT INTO ${tableName} (`;
//   const statementSelect = BuildMysqlStatementSelect(tableName,filterField)
//   if (insertField === undefined) {
//     return baseStatement.slice(0, -1);
//   }
//   if (insertField.length === 1) {
//     return baseStatement + insertField[0] + ') SELECT ?'+' WHERE NOT EXISTS ('+statementSelect+')';
//   }
//   let filterStatement = insertField.join(', ');
//   const questionMarkArray = Array(insertField.length).fill('?');
//   const questionMarkString = questionMarkArray.join(', ');
//   const statementInsert =  baseStatement + filterStatement + ') SELECT ' + questionMarkString + '';
//   return statementInsert+' WHERE NOT EXISTS ('+statementSelect+')'
// }

const pool = mysql.createPool({
  host: env.MYSQLHOST_TEST,
  user: env.MYSQLUID,
  password: env.MYSQLPASSWORD,
  port: env.MYSQLPORT_TEST,
  database: 'TradePlatform',
});

async function SelectQuery(
  tableName: string,
  filterField?: string[],
  filterValue?: any[],
): Promise<object[]> {
  try {
    const sqlStatement = BuildMysqlStatementSelect(tableName, filterField);
    const [results, _fields] = await pool.query<RowDataPacket[]>(sqlStatement, filterValue);
    return results;
  } catch (err) {
    if (err instanceof Error) {
      const sqlErr = err as errorHandling.MySqlError;
      errorHandling.logSqlError(sqlErr);
      throw sqlErr;
    }
    return []; // 錯誤處理備案，防止未知錯誤
  }
}

async function InsertQuery(
  tableName: string,
  insertValue: any[],
  insertField?: string[],
): Promise<ResultSetHeader> {
  try {
    const sqlStatement = BuildMysqlStatementInsert(tableName, insertField);
    const [ResultSetHeader, _FieldPacket] = await pool.query<ResultSetHeader>(
      sqlStatement,
      insertValue,
    );
    //   ResultSetHeader{
    //     "fieldCount": 0,
    //     "affectedRows": 1,
    //     "insertId": 0,
    //     "info": "",
    //     "serverStatus": 2,
    //     "warningStatus": 0,
    //     "changedRows": 0
    // },
    return ResultSetHeader;
  } catch (err) {
    if (err instanceof Error) {
      const sqlErr = err as errorHandling.MySqlError;
      errorHandling.logSqlError(sqlErr);
      throw sqlErr;
    }
    throw err;
  }
}

async function UpdateQuery(
  tableName: string,
  updateField: string[],
  updateAndFilterValue: any[],
  filterField: string,
): Promise<ResultSetHeader> {
  try {
    const sqlStatement = BuildMysqlStatementUpdate(tableName, updateField, filterField);
    const [ResultSetHeader, _FieldPacket] = await pool.query<ResultSetHeader>(
      sqlStatement,
      updateAndFilterValue,
    );
    return ResultSetHeader;
  } catch (err) {
    if (err instanceof Error) {
      const sqlErr = err as errorHandling.MySqlError;
      errorHandling.logSqlError(sqlErr);
      throw sqlErr;
    }
    throw err;
  }
}

async function InsertAfterSelectQuery(
  tableName: string,
  insertValue: any[],
  filterField: string[],
  filterValue: any[],
  insertField?: string[],
): Promise<ResultSetHeader | number> {
  try {
    const selectStatement = BuildMysqlStatementSelect(tableName, filterField);
    const insertStatement = BuildMysqlStatementInsert(tableName, insertField);
    const connection = await pool.getConnection();

    const [results, _fields] = await connection.query<RowDataPacket[]>(
      selectStatement,
      filterValue,
    );
    if (results.length === 0) {
      const [ResultSetHeader, _FieldPacket] = await connection.query<ResultSetHeader>(
        insertStatement,
        insertValue,
      );
      connection.release();
      return ResultSetHeader;
    } else {
      return 0;
    }
  } catch (err) {
    if (err instanceof Error) {
      const sqlErr = err as errorHandling.MySqlError;
      errorHandling.logSqlError(sqlErr);
      throw sqlErr;
    }
    throw err;
  }
}

export { SelectQuery, InsertQuery, UpdateQuery, InsertAfterSelectQuery };
