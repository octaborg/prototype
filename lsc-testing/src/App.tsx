import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {RequiredProof, RequiredProofType} from '../dist/octa.js'
import { Int64, Field } from 'snarkyjs';

let Loan;

const defaultRequiredProof = new RequiredProof(RequiredProofType.avgMonthlyIncomeProof(), 
new Int64(Field.zero), 
new Int64(Field.zero));

function NewLoan() {
  let [snapp, setSnapp] = useState();
  let [isLoading, setLoading] = useState(false);
  let [isDeployed, setDeployed] = useState(false);
  let [loanAmount, setLoanAmount] = useState("0");
  let [interestRate, setInterestRate] = useState("0");
  let [termInDays, setTermInDays] = useState("0");
  let [requiredProofs, setRequiredProofs] = useState([defaultRequiredProof]);

  async function deploy() {
    if (isLoading) return;
    setLoading(true);
    Loan = await import('../dist/loan.contract.js');
    let snapp = await Loan.deploy();
    setLoading(false);
    setDeployed(true);
    setSnapp(snapp);
    let state = await snapp.getSnappState();
  }

  async function handleClick() {
    // await snapp.update();
    // let state = await snapp.getSnappState();
    // setNum(state.num.toString());
  }

  function mapRequiredProofToIndex(requiredProof: RequiredProof) {
    if (requiredProof.requiredProofType.avgMonthlyIncomeProof) {
      return 0;
    }
    if (requiredProof.requiredProofType.avgMonthlyBalanceProof) {
      return 1;
    }
  }

  function addRequiredProof() {
    setRequiredProofs([...requiredProofs, defaultRequiredProof])
  }

  function handleChange(event: SelectChangeEvent) {
    // TODO
  };

  return (
    <Stack component="form"
      noValidate
      autoComplete="off">
      <Box sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}>
        <TextField id="lender-loan-amount" label="Loan Amount" variant="outlined" value={loanAmount} />
        <TextField id="lender-loan-interest-rate" label="Interest Rate" variant="outlined" value={interestRate} />
        <TextField id="lender-loan-term" label="Term in Days" variant="outlined" value={termInDays} />
      </Box>
      {requiredProofs.map((requiredProof, index) => (
        <Box sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}>
          <FormHelperText>Required Proof</FormHelperText>
          <Select
            labelId={"lender-required-proof-select-label-" + index}
            id={"lender-required-proof-select-" + index}
            value={mapRequiredProofToIndex(requiredProof)}
            label="Required Proof"
          >
            <MenuItem value={0}>Average Monthly Income</MenuItem>
            <MenuItem value={1}>Average Monthly Balance</MenuItem>
          </Select>
          <TextField id={"lender-loan-required-proof-lower-bound-" + index} label="Lower Bound" variant="outlined" value={requiredProof.lowerBound.toString()} />
          <TextField id={"lender-loan-required-proof-upper-bound-" + index} label="Upper Bound" variant="outlined" value={requiredProof.upperBound.toString()} />
        </Box>
      ))}
      <Box sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}>
      <Button variant="contained" onClick={addRequiredProof}>Add Required Proof</Button>
      <Button variant="contained" onClick={deploy}>Deploy Loan Contract</Button>
      </Box>
    </Stack>);
}

function App() {
  return (
  <Container fixed>
    <NewLoan />
  </Container>
  );
}


ReactDOM.render(<App />, document.querySelector('#root'));