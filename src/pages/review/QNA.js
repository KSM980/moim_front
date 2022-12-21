import styled from '@emotion/styled/macro';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Box} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import React, {useEffect, useState} from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import {Card, CardActionArea, CardContent, Typography} from '@material-ui/core';
import QnaContent from './QnaContent';
import './Review.css';
import QnaUpdate from './QnaUpdate';
import Pagination from 'react-js-pagination';

//report 신고하기
import QnaReportInsert from './QnaReportInsert';

function QNA(props) {
	const [memberQna, setMemberQna] = useState([]);
	const [sort, setSort] = useState('order by writeday desc');

	// theme의 space list select
	const selectHostRoomList = () => {
		let userNum = jwt_decode(localStorage.getItem('token')).idx;
		let url =
			localStorage.url +
			'/reviewQna/qnaList?userNum=' +
			userNum +
			'&sort=' +
			sort;
		axios.get(url).then((res) => setMemberQna(res.data));
	};

	const handleSortChange = (e) => {
		setSort(e.target.value);
	};

	//페이징처리
	//pagenation
	const [page, setPage] = useState(1);
	let items = 6;

	const handlePageChange = (page) => {
		setPage(page);
	};

	//modal dialogue : OPEN / CLOSE
	const [open, setOpen] = React.useState(false);

	const handleClose = () => {
		setOpen(false);
	};
	useEffect(() => {
		window.scrollTo(0, 0);
		selectHostRoomList();
	}, [sort]);

	return (
		<ListWrapper>
			<SelectDiv>
				{memberQna.length == 0 ? (
					<span className='memberCount'></span>
				) : (
					<span className='memberCount'>총 {memberQna.length}개</span>
				)}
				<FormControl sx={{m: 1, minWidth: 120}} size='small'>
					<Select
						labelId='demo-select-small'
						id='demo-select-small'
						value={sort}
						onChange={handleSortChange}
					>
						<MenuItem value={'order by writeday desc'}>
							최신순
						</MenuItem>
						<MenuItem
							value={
								'and answer is not null order by writeday asc'
							}
						>
							답글있음
						</MenuItem>
						<MenuItem
							value={'and answer is null order by writeday asc'}
						>
							답글없음
						</MenuItem>
					</Select>
				</FormControl>
			</SelectDiv>
			<ReviewList>
				<CardWrapper>
					{memberQna.length == 0 ? (
						<Wrapper>
							<h5
								style={{
									height: '300px',
									width: '100%',
									lineHeight: '300px',
									textAlign: 'center',
									fontFamily: 'NanumSquareRound',
								}}
							>
								<b>현재 등록된 Q&A가 없습니다.</b>
							</h5>
						</Wrapper>
					) : (
						memberQna &&
						memberQna
							.slice(
								items * (page - 1),
								items * (page - 1) + items,
							)
							.map((item, index) => (
								<Card style={{width: '100%'}}>
									<CardActionArea style={{cursor: 'auto'}}>
										<CardContent>
											<Typography
												gutterBottom
												component='div'
												style={{
													fontWeight: 'bold',
													borderBottom:
														'1px solid #7b68ee',
													paddingBottom: '10px',
												}}
											>
												<div
													style={{
														display: 'flex',
														justifyContent:
															'space-between',
													}}
												>
													<Status
														style={{
															backgroundColor:
																item.status ==
																'답변완료'
																	? '#afafaf'
																	: '#704de4',
														}}
													>
														{item.status}
													</Status>
													{item.status ==
													'답변완료' ? (
														<QnaReportInsert
															qnaNum={item.num}
															roomNum={
																item.roomNum
															}
														/>
													) : (
														''
													)}
												</div>
											</Typography>
											<Typography
												variant='body1'
												component='div'
												color='text.secondary'
												style={{marginTop: '25px'}}
											>
												<Space>
													공간명 :
													<span
														style={{
															textDecoration:
																'underline',
															color: '#7b68ee',
															cursor: 'pointer',
														}}
														onClick={() => {
															window.location.href =
																'http://localhost:3000/detail/' +
																item.roomNum;
														}}
													>
														{item.name}
													</span>
												</Space>
												<SpaceContent>
													{item.title}
												</SpaceContent>
												<SpaceWriteday>
													{item.writeday}
												</SpaceWriteday>
											</Typography>
										</CardContent>
										{item.status == '답변대기중' ? (
											<div
												style={{
													display: 'flex',
													width: '100%',
													flexDirection: 'row',
													flexWrap: 'wrap',
													justifyContent:
														'space-evenly',
													marginBottom: '20px',
												}}
											>
												<QnaUpdate
													qnaNum={item.num}
													status={item.status}
												/>
												<QnaContent
													qnaNum={item.num}
													status={item.status}
												/>
											</div>
										) : (
											<div
												style={{
													display: 'flex',
													width: '100%',
													flexDirection: 'row',
													flexWrap: 'wrap',
													justifyContent:
														'space-evenly',
													marginBottom: '20px',
												}}
											>
												<QnaContent
													qnaNum={item.num}
													status={item.status}
												/>
											</div>
										)}
									</CardActionArea>
								</Card>
							))
					)}
				</CardWrapper>
			</ReviewList>
			<div>
				<Pagination
					activePage={page}
					itemsCountPerPage={6}
					totalItemsCount={memberQna.length}
					pageRangeDisplayed={6}
					prevPageText={'‹'}
					nextPageText={'›'}
					onChange={handlePageChange}
				/>
			</div>
		</ListWrapper>
	);
}

export default QNA;

const ListWrapper = styled(Box)`
	padding-bottom: 100px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: 10px;
`;
const SelectDiv = styled(Box)`
	display: flex;
	width: 100%;
	margin-bottom: 10px;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: space-between;
`;
const ReviewList = styled(Box)`
	// display: grid;
	width: 100%;
`;
const CardWrapper = styled(Typography)`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 20px 20px;
`;
const Wrapper = styled(Typography)`
	grid-column: span 3;
`;

const Space = styled(Typography)`
	font-weight: bold;
	font-family: 'NanumSquareRound';
`;
const SpaceContent = styled(Typography)`
	font-size: 16px;
	margin-top: 10px;
	font-family: 'NanumSquareRound';
`;
const SpaceWriteday = styled(Typography)`
	color: #b2b2b2;
	font-size: 13px;
	margin-top: 10px;
`;
const Status = styled(Typography)`
	width: auto;
	margin: 7px 7px 7px 0;
	padding: 0 15px;
	height: 29px;
	font-size: 12px;
	line-height: 29px;
	border-radius: 29px;
	display: inline-block;
	border: 1px solid #e0e0e0;
	color: #fff;
`;
