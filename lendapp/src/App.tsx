import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {RequiredProof, RequiredProofType} from '../dist/octa.js'
import {Int64, UInt64, Field, Poseidon} from 'snarkyjs';
import {RequiredProofs} from './octa.js';

let LoanContract;

const loanStore = [];

const defaultRequiredProof = new RequiredProof(RequiredProofType.avgMonthlyIncomeProof(),
    new Int64(Field.zero),
    new Int64(Field.zero));

function Borrow() {
    return <BorrowTable loanDataList={loanStore}/>;
}

interface BorrowTableProps {
    children?: React.ReactNode;
    loanDataList: Array<any>;
}

function BorrowTable(props: BorrowTableProps) {
    const [open, setOpen] = React.useState(false);

    const {loanDataList} = props;

    let loanToBorrowFrom;

    function borrowPopUp(data: Any) {
        loanToBorrowFrom = data;
        setOpen(true);
    }

    function borrowPopUpClose() {
        loanToBorrowFrom = null;
        setOpen(false);
    }

    function constructProofsAndRequestLoan() {
        // TODO
        loanToBorrowFrom = null;
        setOpen(false);
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="available loan table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Loan Contract Address (Public Key)</TableCell>
                            <TableCell>Available Amount</TableCell>
                            <TableCell>Interest Rate</TableCell>
                            <TableCell>Term in Days</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loanDataList.map((row) => (
                            <TableRow
                                // TODO how to convert this to proper pub key hash?
                                key={Poseidon.hash(row.address.toFields()).toString()}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell align="right">{Poseidon.hash(row.address.toFields()).toString()}</TableCell>
                                <TableCell align="right">{row.availableToLend.value.toString()}</TableCell>
                                <TableCell align="right">{row.interestRate.toString()}</TableCell>
                                <TableCell align="right">{row.termInDays.toString()}</TableCell>
                                <TableCell align="left">
                                    <Button variant="contained" onClick={() => borrowPopUp(row)}>Borrow</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={borrowPopUpClose}>
                <DialogTitle>Borrow</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                       Please set the amount you would like to borrow. Once you click "Confirm" we would contact your
                        bank to construct necessary proofs of your financial standing. Don't worry your private transactional
                        information provided by the bank never leaves your computer.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="amount"
                        label="Amount"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={borrowPopUpClose}>Cancel</Button>
                    <Button onClick={constructProofsAndRequestLoan}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function NewLoan() {
    let [isLoading, setLoading] = useState(false);
    let [loanAmount, setLoanAmount] = useState('0');
    let [interestRate, setInterestRate] = useState('0');
    let [termInDays, setTermInDays] = useState('0');
    let [requiredProofs, setRequiredProofs] = useState([Object.assign({}, defaultRequiredProof)]);
    let [availableLoans, setAvailableLoans] = useState(new Array<any>())

    async function deploy() {
        if (isLoading) return;
        setLoading(true);
        LoanContract = LoanContract || await import('../dist/loan.contract.js');
        let snapp = await LoanContract.deploy(
            new UInt64(new Field(loanAmount)),
            new Field(interestRate),
            new Field(termInDays),
            new RequiredProofs(requiredProofs));
        setLoading(false);
        let state = await snapp.getSnappState();
        loanStore.push(state);
        // console.log(state);
        setAvailableLoans(loanStore);
    }

    async function handleClick() {
        // await snapp.update();
        // let state = await snapp.getSnappState();
        // setNum(state.num.toString());
    }

    function mapRequiredProofToIndex(requiredProof: RequiredProof) {
        if (requiredProof.requiredProofType.avgMonthlyIncomeProof.toBoolean()) {
            return '0';
        }
        if (requiredProof.requiredProofType.avgMonthlyBalanceProof.toBoolean()) {
            return '1';
        }
        return '0';
    }

    function mapIndexToRequiredProof(index: string) {
        if (index == '0') {
            return RequiredProofType.avgMonthlyIncomeProof();
        }
        if (index == '1') {
            return RequiredProofType.avgMonthlyBalanceProof();
        }
        return RequiredProofType.avgMonthlyIncomeProof();
    }

    function addRequiredProof() {
        setRequiredProofs([...requiredProofs, Object.assign({}, defaultRequiredProof)])
    }

    function handleLoanAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLoanAmount(event.target.value);
    }

    function handleInterestRateChange(event: React.ChangeEvent<HTMLInputElement>) {
        setInterestRate(event.target.value);
    }

    function handleTermInDaysChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTermInDays(event.target.value);
    }

    function handleRequiredProofSelectChange(event: SelectChangeEvent) {
        let index = event.target.name;
        let value = event.target.value;
        let edited = requiredProofs[parseInt(index)];
        edited.requiredProofType = mapIndexToRequiredProof(value);
        requiredProofs[parseInt(index)] = Object.assign({}, edited);
        setRequiredProofs([...requiredProofs]);
    }

    function handleRequiredProofBoundChange(event: React.ChangeEvent<HTMLInputElement>) {
        let index = event.target.name;
        let id = event.target.id;
        let value = event.target.value;
        let edited = requiredProofs[parseInt(index)];
        if (id == "lender-loan-required-proof-lower-bound-" + index) {
            edited.lowerBound = new Int64(new Field(value));
        }
        if (id == "lender-loan-required-proof-upper-bound-" + index) {
            edited.upperBound = new Int64(new Field(value));
        }
        requiredProofs[parseInt(index)] = Object.assign({}, edited);

        setRequiredProofs([...requiredProofs]);
    }

    return (
        <Stack>
            <Box sx={{
                '& > :not(style)': {m: 1, width: '25ch'},
            }}>
                <TextField id="lender-loan-amount" label="Loan Amount" variant="outlined" value={loanAmount}
                           onChange={handleLoanAmountChange}/>
                <TextField id="lender-loan-interest-rate" label="Interest Rate" variant="outlined" value={interestRate}
                           onChange={handleInterestRateChange}/>
                <TextField id="lender-loan-term" label="Term in Days" variant="outlined" value={termInDays}
                           onChange={handleTermInDaysChange}/>
            </Box>
            {requiredProofs.map((requiredProof, index) => (
                <Box sx={{
                    '& > :not(style)': {m: 1, width: '25ch'},
                }}>
                    <FormHelperText>Required Proof</FormHelperText>
                    <Select
                        labelId={"lender-required-proof-select-label-" + index}
                        id={"lender-required-proof-select-" + index}
                        value={mapRequiredProofToIndex(requiredProof)}
                        name={"" + index}
                        label="Required Proof"
                        onChange={handleRequiredProofSelectChange}
                    >
                        <MenuItem value={0}>Average Monthly Income</MenuItem>
                        <MenuItem value={1}>Average Monthly Balance</MenuItem>
                    </Select>
                    <TextField name={"" + index} id={"lender-loan-required-proof-lower-bound-" + index}
                               label="Lower Bound" variant="outlined" value={requiredProof.lowerBound.toString()}
                               onChange={handleRequiredProofBoundChange}/>
                    <TextField name={"" + index} id={"lender-loan-required-proof-upper-bound-" + index}
                               label="Upper Bound" variant="outlined" value={requiredProof.upperBound.toString()}
                               onChange={handleRequiredProofBoundChange}/>
                </Box>
            ))}
            <Box sx={{
                '& > :not(style)': {m: 1, width: '25ch'},
            }}>
                <Button variant="contained" onClick={addRequiredProof}>Add Required Proof</Button>
                <Button variant="contained" onClick={deploy}>Deploy Loan Contract</Button>
            </Box>
            <LoanTable loanDataList={availableLoans.length == 0 ? loanStore : availableLoans}/>
        </Stack>);
}

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

interface LoanTableProps {
    children?: React.ReactNode;
    loanDataList: Array<any>;
}

function LoanTable(props: LoanTableProps) {
    const {loanDataList} = props;

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="available loan table">
                <TableHead>
                    <TableRow>
                        <TableCell>Address (Public Key)</TableCell>
                        <TableCell>Available Amount</TableCell>
                        <TableCell>Interest Rate</TableCell>
                        <TableCell>Term in Days</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loanDataList.map((row) => (
                        <TableRow
                            // TODO how to convert this to proper pub key hash?
                            key={Poseidon.hash(row.address.toFields()).toString()}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell align="right">{Poseidon.hash(row.address.toFields()).toString()}</TableCell>
                            <TableCell align="right">{row.availableToLend.value.toString()}</TableCell>
                            <TableCell align="right">{row.interestRate.toString()}</TableCell>
                            <TableCell align="right">{row.termInDays.toString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function App() {
    const [tab, setTab] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setTab(index);
    };

    function a11yProps(index: number) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    return (
        <Container fixed>
            <Box position="static">
                <Tabs
                    value={tab}
                    onChange={handleChange}
                    aria-label="lending and borrowing"
                >
                    <Tab label="Lend" {...a11yProps(0)} />
                    <Tab label="Borrow" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
                <NewLoan/>
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <Borrow/>
            </TabPanel>
        </Container>
    );
}


ReactDOM.render(<App/>, document.querySelector('#root'));