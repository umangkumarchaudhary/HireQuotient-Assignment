import React, { useEffect, useState , useMemo} from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import './HoldingsTable.css';

const HoldingsTable = () => {
    const [holdings, setHoldings] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      setLoading(true);
      axios.get('https://canopy-frontend-task.now.sh/api/holdings')
        .then(response => {
          setHoldings(response.data.payload);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data');
          setLoading(false);
        });
    }, []);

    const groupedHoldings = useMemo(() => {
        return holdings.reduce((acc, holding) => {
          const { asset_class } = holding;
          if (!acc[asset_class]) {
            acc[asset_class] = [];
          }
          acc[asset_class].push(holding);
          return acc;
        }, {});
      }, [holdings]);
    
      const toggleExpansion = (assetClass) => {
        setExpandedGroups(prevState => ({
          ...prevState,
          [assetClass]: !prevState[assetClass]
        }));
      };
  
  
    if (error) {
      return <div>{error}</div>;
    }
  
  

  return (
    <div className="tableWrapper"> 
      <TableContainer component={Paper} className="tableContainer"> 
        <Table>
          <TableBody>
            {Object.keys(groupedHoldings).map((assetClass, index) => (
              <React.Fragment key={index}>
              <TableRow sx={{ backgroundColor: 'white' }}>
              <TableCell colSpan={7}>
                <IconButton
                  size="small"
                  onClick={() => toggleExpansion(assetClass)}
                  sx={{
                    color: expandedGroups[assetClass] ? 'blue' : 'rgba(0, 0, 0, 0.54)',
                    borderRadius:'50%',
                    marginRight: '8px', 
                    
                  
                  }}
                >
                  {expandedGroups[assetClass] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'inline',
                    marginRight: '16px', 
                  }}
                  onClick={() => toggleExpansion(assetClass)}
                >
                  {`${assetClass} (${groupedHoldings[assetClass].length})`}
                </Typography>
              </TableCell>
            </TableRow>
                {expandedGroups[assetClass] && (
                  <>
                  <TableHead sx={{ backgroundColor: 'white' }}>
                    <TableRow>
                      <TableCell className="tableHeaderCell">Name Of the Holdings</TableCell>
                      <TableCell className="tableHeaderCell">Ticker</TableCell>
                      <TableCell className="tableHeaderCell">Asset Class</TableCell>
                      <TableCell className="tableHeaderCell">Average Price</TableCell>
                      <TableCell className="tableHeaderCell">Market Price</TableCell>
                      <TableCell className="tableHeaderCell">Latest Change Percentage</TableCell>
                      <TableCell className="tableHeaderCell">Market Value (Base CCY)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedHoldings[assetClass].map((holding, subIndex) => (
                      <TableRow key={subIndex} className={subIndex % 2 === 0 ? 'tableDataRowLightBlue' : 'tableDataRowWhite'}>
                        <TableCell className="tableDataCell">{holding.name}</TableCell>
                        <TableCell className="tableDataCell">{holding.ticker}</TableCell>
                        <TableCell className="tableDataCell">{holding.asset_class}</TableCell>
                        <TableCell className="tableDataCell">{holding.avg_price}</TableCell>
                        <TableCell className="tableDataCell">{holding.market_price}</TableCell>
                        <TableCell className="tableDataCell">
                          <Typography style={{ color: holding.latest_chg_pct < 0 ? 'red' : 'inherit' }}>
                            {holding.latest_chg_pct}
                          </Typography>
                        </TableCell>
                        <TableCell className="tableDataCell">{holding.market_value_ccy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default HoldingsTable;
