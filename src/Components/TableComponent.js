import * as React from 'react';
import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Table, TextField } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}





export default function TableComponent({ headers, dataRows }) {

  const [data, setData] = React.useState(dataRows)

  const TableHeader = (item, idx) => {

    return <StyledTableCell key={idx}> {item.header} </StyledTableCell>
  }

  const handleOnChangeRowItem = (index, key, event) => {
    let copy = [...data]
    copy[index][key] = event.target.value;
    setData(copy)
  }

  const TableRow = (index, key) => {
    return <StyledTableCell align="right">
      
     a</StyledTableCell>
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {headers.map((item, idx) => { return TableHeader(item, idx) })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow key={row["Product"]}>
              {Object.keys(row).map((key) => {
                return TableRow(index, key)
              })}
              <StyledTableCell align="right">{row.protein}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}