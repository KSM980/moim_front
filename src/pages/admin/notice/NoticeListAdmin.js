import axios from 'axios';
import React, {useEffect, useState} from 'react';
import Pagination from 'react-js-pagination';
import {Link} from 'react-router-dom';
import NoticeUpdate from './NoticeUpdate';

function NoticeListAdmin(props) {
	const {noticeList, setNoticeList, searchWord, sort} = props;

	//공지사항 list 가져오기
	const getNoticeList = () => {
		let url =
			localStorage.url +
			'/admin/noticeList?searchWord=' +
			searchWord +
			'&sort=' +
			sort;

		axios.get(url).then((res) => {
			setNoticeList(res.data);
		});
	};

	useEffect(() => {
		//공지사항 리스트 가져오기
		getNoticeList();
	}, [searchWord, sort]); //searchWord 값이 바뀔때마다

	//공지사항 삭제를 위한 num 변수 선언
	var num = '';

	//공지사항 삭제하기 delete
	const deleteNotice = () => {
		//confirm alert
		if (window.confirm('삭제하시겠습니까?')) {
			//예
			//url에 num값 보내기
			let url = localStorage.url + '/admin/deleteNotice?num=' + num;
			console.log(url);

			//Back-End로 url 넘김
			axios.delete(url).then((res) => {
				//성공하고 리스트 다시 가져오기
				getNoticeList();
				// window.location.reload();
			});

			//삭제완료 alert
			alert('삭제되었습니다.');
		} else {
			//아니오
			alert('취소하셨습니다');
		}
	};

	//페이징 처리 - pagenation
	const [page, setPage] = useState(1);

	//한번에 보여질 아이템 수
	let items = 10;

	//페이지 변경 이벤트
	const handlePageChange = (page) => {
		setPage(page);
	};

	return (
		<div className='noticeTable' style={{marginTop: '20px', width: '100%'}}>
			<table className='' style={{width: '100%'}}>
				<thead>
					<tr style={{textAlign: 'center'}}>
						<th style={{width: '5%'}}>번호</th>
						<th style={{width: '10%'}}>유형</th>
						<th>제목</th>
						<th style={{width: '15%'}}>작성일자</th>
						<th style={{width: '20%'}}>수정 / 삭제</th>
					</tr>
				</thead>
				<tbody>
					{noticeList.length === 0 ? (
						//데이터가 없을때
						<tr>
							<td colSpan={5} style={{textAlign: 'center'}}>
								<h5>
									<b>등록된 게시글이 없습니다.</b>
								</h5>
							</td>
						</tr>
					) : (
						noticeList &&
						noticeList

							.map((row, idx) => (
								<tr style={{verticalAlign: 'middle'}} key={idx}>
									<td>{idx + 1}</td>
									<td>{row.type}</td>
									<td>
										{/* <Link to={'/notice'}>{row.title}</Link> */}
										<span
											style={{
												textDecoration: 'underLine',
												cursor: 'pointer',
											}}
											onClick={() =>
												window.open('/notice', '_blank')
											}
										>
											{row.title}
										</span>
									</td>
									<td>{row.writeday}</td>
									<td>
										<div
											style={{
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											<NoticeUpdate num={row.num} />
											&emsp;
											<button
												type='button'
												className='btn btn-outline-danger'
												// onClick={(e) => {
												// 	console.log(e.target.value);
												// }}
												value={row.num}
												onClick={(e) => {
													num = e.target.value;

													deleteNotice();
												}}
											>
												삭제
											</button>
										</div>
									</td>
								</tr>
							))
							.slice(
								items * (page - 1),
								items * (page - 1) + items,
							)
					)}
				</tbody>
			</table>
			{/* 페이지네이션 생기는 위치 */}
			<div className='pageDiv'>
				<Pagination
					activePage={page} // 현재 보고있는 페이지
					itemsCountPerPage={10} // 한 페이지에 출력할 아이템 수
					totalItemsCount={noticeList.length} // 총 아이템 수
					pageRangeDisplayed={5} // 표시할 아이템 수
					prevPageText={'‹'}
					nextPageText={'›'}
					onChange={handlePageChange}
				/>
			</div>
		</div>
	);
}

export default NoticeListAdmin;
