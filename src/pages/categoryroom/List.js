import { FormControl } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Card from './Card';

function List(props) {
    const { roomData } = props;
    const [data, setData] = useState([]);
    const {
        sort,
        setSort,
    } = props;

    const handleChange = (e) => {
        setSort(e.target.value);
    };
    console.log(roomData)

    return (
        <>
            <ListWrapper>
                <SelectDiv>
                    <FormControl sx={{ m: 1, minWidth: 110 }} size='small'>
                        <Select
                            labelId='demo-select-small'
                            id='demo-select-small'
                            value={sort}
                            onChange={handleChange}
                            defaultValue={'a.writeday desc'}
                        >
                            <MenuItem value={'a.writeday desc'}>최신순</MenuItem>
                            <MenuItem value={'a.readCount desc'}>인기순</MenuItem>
                            <MenuItem value={'a.weekAmPrice asc'}>
                                낮은 가격순
                            </MenuItem>
                            <MenuItem value={'a.weekAmPrice desc'}>
                                높은 가격순
                            </MenuItem>
                        </Select>
                    </FormControl>
                </SelectDiv>
            </ListWrapper>
            {/* <hr /> */}
            <RoomList>
                {roomData &&
                    roomData.map((item, i) => (
                        <Card roomData={item} key={i} roomNum={item.num} />
                    ))}
            </RoomList>
        </>
    );
}

const ListWrapper = styled(Box)`
	margin-bottom: -20px;
	padding-Top: 5px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;
const SelectDiv = styled(Box)`
	display: flex;
	justify-content: flex-end;
	width: 100%;
	margin: 20px 0;
    margin-right:25px;
    padding:5px;
`;
const RoomList = styled(Box)`
    margin-top:20px;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	width: 100%;
`;

export default List;