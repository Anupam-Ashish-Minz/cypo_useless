import './App.css';
import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { TextField, InputAdornment, Container, Grid, Accordion,
    AccordionSummary, AccordionDetails, Typography,
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

export interface CoinGeckoApi {
    //id	"bitcoin"
    //symbol	"btc"
    //name	"Bitcoin"
    //image	"https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579"
    //current_price	35130
    //market_cap	653611312633
    //market_cap_rank	1
    //fully_diluted_valuation	737738793910
    //total_volume	50198011517
    //high_24h	37690
    //low_24h	35021
    //price_change_24h	-1422.00571619
    //price_change_percentage_24h	-3.89032
    //market_cap_change_24h	-26813280208.433838
    //market_cap_change_percentage_24h	-3.94067
    //circulating_supply	18605281
    //total_supply	21000000
    //max_supply	21000000
    //ath	41940
    //ath_change_percentage	-16.23667
    //ath_date	"2021-01-08T15:05:37.863Z"
    //atl	67.81
    //atl_change_percentage	51707.89977
    //atl_date	"2013-07-06T00:00:00.000Z"
    //roi	null
    //last_updated	"2021-01-20T04:19:36.500Z"
    id: string,
    symbol: string,
    name: string,
    image: string,
    current_price: number,
    market_cap: number,
    market_cap_rank: number
    fully_diluted_valuation: number,
    total_volume: number,
    high_24h: number,
    low_24h: number,
    price_change_24h: number,
    price_change_percentage_24h: number,
    market_cap_change_24h: number,
    market_cap_change_percentage_24h: number,
    circulating_supply: number,
    total_supply: number,
    max_supply: number,
    ath: number,
    ath_change_percentage: number,
    ath_date: Date,
    atl: number,
    atl_change_percentage: number,
    atl_date: Date,
    roi: null,
    last_updated: Date,
};

function App() {
    const [data, setData]: [
        CoinGeckoApi[] | undefined, 
        (data: CoinGeckoApi[])=>void
    ] = useState();
    const [displayData, setDisplayData]: [
        CoinGeckoApi[] | undefined,
        (data: CoinGeckoApi[])=>void
    ] = useState();
    const [searchValue, setSearchValue]: [string, any] = useState("");

    const handleInput = (event: any) => {
        setSearchValue(event.target.value);
    };

    const updateSearchResultFuse = () => {
        if (data) {
            const fuseOptions = {
                keys: [
                    "id"
                ]
            }
            type FuseResult = {
                item: CoinGeckoApi,
                refIndex: number,
                score: number
            };
            const fuse = new Fuse(data, fuseOptions);
            if (searchValue) {
                const searchResult: FuseResult[] = fuse.search(searchValue) as FuseResult[];
                const result: CoinGeckoApi[] = searchResult.map((x: FuseResult) => x.item);
                setDisplayData(result);
            } else {
                setDisplayData(data);
            }
        }
    };

    const updateSearchResult = () => {
        if (data) {
            const searchResult = data.filter((obj: CoinGeckoApi) => obj.id.includes(searchValue));
            setDisplayData(searchResult);
        }
    };

    const fetchData = () => {
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        .then(data => data.json())
        .then(data => setData(data));
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data) {
            setDisplayData(data);
        }
    }, [data]);

    useEffect(() => {
        //updateSearchResult();
        updateSearchResultFuse();
    }, [searchValue]);

    return (
        <Container style={{marginTop: "10px"}}>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="stretch" >
                { /*<input type="text" className="search-box" onChange={handleInput} /> */}
                <Grid item>
                    <TextField 
                        variant="outlined" 
                        onChange={handleInput} 
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                {console.log(displayData)}
                {displayData ? displayData.map((elem: any) => {
                    return (
                        <Accordion key={elem.id} >
                            <AccordionSummary>
                                <img src={elem.image} alt="not found" className="api-image" style={{marginRight:"10px"}} />
                                <Typography variant="h6">{elem.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                Current Price: ${elem.current_price}
                            </AccordionDetails>
                        </Accordion>
                    );
                }) : null}
            </Grid>
        </Container>
    );
}

export default App;
