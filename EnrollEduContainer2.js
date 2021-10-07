import React, { useState, useEffect  } from 'react';
import $ from 'jquery';
// import styles from 'index.scss';
// import classNames from 'classnames/bind';
import * as SOrderActions from 'app/store/modules/order';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import * as educationActions from 'app/store/modules/education';
import * as commonActions from 'app/store/modules/common';
import { CODES } from 'app/config/commonkey';
import axios from 'axios';

import {
  Loading,
  ContentTable,
  ContentWidget,
  ContentXearch,
  EnrollEduModal,
  EduApprovalModal,
  ConfirmModal
} from 'app/components';
//const cx = classNames.bind(styles);
const URL_PATH ='/training/v1.0/training'//container 조회
const URL_PATH_INSERT = '/training/v1.0/training';// 모달1 INSERT
const URL_PATH_UPDATE = '/training/v1.0/training';// 모달1 UPDATE
const URL_PATH_DELETE = '/training/v1.0/training';// 모달1 DELETE
const URL_PATH_APPRL = '/training/v1.0/training/register';// 모달 그리드 SELECT (교육신청번호 + companyseqid도 같이 보내야함)

const EnrollEduContainer2 =({commonActions,pages}) =>{
  
  // constructor() {
  //   super();
const [open, setOpen] = useState(false);
const [openOrder, setOpenOrder] = useState(false);
const [openConfirm, setopenConfirm] = useState(false);
const [openAPPRL, setOpenAPPRL] = useState(false);
const [mode, setMode] = useState(null);
let   [selected, setInputs] =useState({ });
let   [selected2, setInputs2] = useState({ },[]);
let   [gridSelectData, setGridSelectData] = useState({ },[]);
const [currentPage, setPage] = useState(1);
const [currentPageModal, setPageModal] = useState(1);
const [currentPageModal2, setPageModal2] = useState(1);
const [currentPageModalSelect, setPageModalSelect] = useState(1);
const [search, setSearch] = useState({ },[]);
const [search2, setSearch2] = useState({ },[]);
const [searchCommon, setSearchCommon] = useState({ },[]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [status, setStatus] = useState('ready');
const [modalList, setModalList] = useState({ },[]);
const [tabId, setTabId] = useState({ },[]);
const [errorModal, setErrorModal] = useState(null);
const [optionInit, setOptionInit] = useState(false);
const [modalStandAPPRL, setModalStandAPPRL] = useState({ },[]);
const [onCloseModal, setOnCloseModal] = useState({ },[]);

const [list, setList] = useState({ });

useEffect(() => { handleLoad(); handleLoad3()},[]);

const handleLoad3 = async (gubun,e) => {

  console.log("###### this.state.search2 ######");
   console.log(search2);
   var query = JSONtoString(search2);
   console.log("@@@query")
   console.log(query)
  //const { SOrderActions } = this.props;
  
  //  if(e){ search2["comProduct"] = e; } //모달 최초 조회시 기본교재 = COMPRO01로 조회
  //  console.log("search");
  //  console.log(search2);
   
  try {
    //console.log('############ query - JSONtoString ##############');
    var query = JSONtoString(search2);
    SOrderActions.setOptionStatus(gubun);
    await SOrderActions.getOrderListNormalProd(query);
    SOrderActions.setError(null);
  } catch (e) {
    console.log(e);
  }

}

  //   this.onChange = this.onChange.bind(this);
  //   this.onChangeModal = this.onChangeModal.bind(this);
  //   this.onSearch = this.onSearch.bind(this);
  //   this.onSearch2 = this.onSearch2.bind(this);
  //   this.onSubmit = this.onSubmit.bind(this);
  //   this.onClose = this.onClose.bind(this);

  //   this.onChangePage = this.onChangePage.bind(this);
  //   this.onChangePageModal = this.onChangePageModal.bind(this);
  //   this.onChangePageModalSelect = this.onChangePageModalSelect.bind(this);


  //   this.handleLoad = this.handleLoad.bind(this);
  //   this.handleInsert = this.handleInsert.bind(this);
  //   this.handleUpdate = this.handleUpdate.bind(this);
  //   this.handleDelete = this.handleDelete.bind(this);

  //   this.handleLoadAPPRL = this.handleLoadAPPRL.bind(this);
  //   this.handleUpdateAPPRL = this.handleUpdateAPPRL.bind(this);

  //   // this.handleUpdateCancle = this.handleUpdateCancle.bind(this);

  //   this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this);
  //   this.handleRowClick = this.handleRowClick.bind(this);
  //   this.onClickTab = this.onClickTab.bind(this);

  //   this.handleErrorModal = this.handleErrorModal.bind(this);

  // }

  // componentDidMount() {
  //   this.handleLoad(false);
  //   this.handleLoadAPPRL();
  // }

  // componentWillReceiveProps(nextProps) {

  //   //console.log('##### componentWillReceiveProps #####');

  //   let history = nextProps.history;

  //   if (nextProps.loginResult && nextProps.loginResult.data) {
  //     history.push('/main');
  //   }
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   //console.log('##### shouldComponentUpdate #####');
  //   //console.log(nextProps);

  //   if (nextProps.status && nextProps.status === "refresh") {
  //     // this.handleLoadCommon();
  //     // this.onCloseModal();
  //     // const { educationActions } = this.props;
  //     // educationActions.setStatus();
  //     // this.onSearch();
  //     return true;
  //   }
  //   return true;
  // }

  const handleRowClick = (datas) => {
    
    setInputs({});
    setOptionInit(false);
    setOpenAPPRL(true);
    setMode ('create');
    setInputs (datas);
    handleLoadAPPRL(datas)
  
  }

  const handleRowDoubleClick = (datas) => {
    setOpen(true);
    setMode('detail');
    setInputs(datas);
    setOptionInit(false);
  }

  const onChangePage = (val) => {
    console.log('##### onChangePage #####' , val);
    setPage(val);
    setOptionInit(false);
  }

  const onChangePageModal = (val) => {
    console.log('##### onChangePageModal #####' , val);
    setPageModal(val);
  }
  
  // const onChangePageModalSelect = (val) => {
  //   console.log('##### onChangePageModalSelect #####' , val);
  //   setPageModalSelect(val);
  // }

  // onChange(e) {
  //   // console.log('##### onChange  ' + e.target.name + ':' + e.target.value);
  //   const newSearched = this.state.search;

  //   let value = "";
  //   if (e.target.value !== "") value = e.target.value;

  //   newSearched[e.target.name] = value;
  //   this.setState({ search: newSearched });
  //   //this.setState({[e.target.name]: e.target.value});
  // }

  // onChange2(e) {
    
  //   console.log('##### onChange2  ' + e.target.name + ':' + e.target.value);
  //   const newSearched = this.state.search2;

  //   let value = null;
  //   if(e.target.value!=="") value = e.target.value;

  //   newSearched[e.target.name] = value;
  //   this.setState({search2 : newSearched});
  //   //this.setState({[e.target.name]: e.target.value});
  // }

  const onChangeModal = (e)=> {
    
    console.log('##### onChangeModal this.state.selected  ::: ' + selected);
    console.log(selected);
    console.log('##### onChangeModal  ' + e.target.name + ':' + e.target.value);

    // e.persist();
    const newSelected = selected;

    // newSelected[e.target.name] =e.target.value;

    if(e.target.files){
      if(e.target.files){
        newSelected[e.target.name] = e.target.files;
      }
    }
    else{
      
      newSelected[e.target.name] = e.target.value;
    }
    setInputs({...newSelected});
  //   this.setState({selected : newSelected});    
  //   console.log(">>>>>>>>")
  //   console.log(this.state.selected)
  //   //this.setState({ ...selected, [e.target.name]: e.target.value});
  }

  const onClickTab= async (e) => {
    e.persist();
    console.log("###search###")
    console.log(search)
    //search["trainingTitle"] =search[] ""; 
    
    //선택된값에 활성화 클래스가 있을경우 활성화 class삭제
    let selectedRemove = document.querySelectorAll(".btn-success")
    // console.log("selectedRemove>>>>>")
    // console.log(selectedRemove)
    for(let i=0;i<selectedRemove.length;i++) selectedRemove[i].classList.remove("active")

    console.log("onClickLevel #######################");
    console.log(e.target.id); 
    const tabId = e.target.id

    let selectedLevel =  e.target
    selectedLevel.classList.add("active");   

   search["trainingType"] = tabId;

    handleLoad(true);
    setPage(1);
  }

  // onSubmit(e) {
  //   e.preventDefault();
  // }

  const onSearch = () => {
    console.log('####### onSearch #######');
    setPage(1);
    handleLoad(true);  
   }
   const onSearch2 = () => {
    setPageModal(1);
    setPageModalSelect(1)
    handleLoadAPPRL();
  }

  const onSearchInit = () => {
    console.log('####### onSearchInit #######');
    console.log(search);

    const newSearch = {};
    setSearch(newSearch);
    console.log(search);
  }

  // /* callback함수 callbackModal - onClose */
  // onClose(e) {

  //   console.log('##### onClose Modal #####');

  //   const modalFlag = {};
  //   modalFlag[e.target.name] = e.target.value;
  //   console.log(modalFlag);
  //   this.setState(modalFlag);

  //   this.onSearch();

  // }

  const onOpenModal= async (e) => {
    e.preventDefault();

    setOptionInit(false);
    setOpen(true);
    setMode ('create');
    // console.log("this.state.search")
    // console.log(this.state.search)
    const newSelected = {};
    newSelected["trainingType"] = search && search.trainingType?search.trainingType:"";  //선택한 카테고리 값 부여
    // newSelected["targetBranch"] = "T";
    // newSelected["targetSchool"] = "T";   // default공지대상 체크
    // newSelected["calendarCheck"] = "T";  // default일정 체크
    
    setInputs(newSelected);
  }

  // onCloseModal = () => {
  //   setOpen(false);
  //   setErrorModal("");
  //   handleLoad(false);
  //   // this.onSearch();
  // };

  const onCloseAPPRL = () => {
    setOpenAPPRL(false);
    handleLoad(false);
  };

  // onOpenAPPRL(e) {
  //   e.preventDefault();
  //   this.onSearch2();

  //   this.setState({ openAPPRL: true });
  //   this.setState({ mode: 'create' });
  //   this.setState({ selected: {} });
  // }

  const onOpenConfirmModal = () => { 
    console.log("##### onOpenConfirmModal #####"); 
    setopenConfirm (true);
    setOpen(false);
  }
  
  const onCloseConfirmModal = () => { 
    console.log("##### onCloseConfirmModal #####"); //컨펌 창 close
    setopenConfirm (false);
  }

  const JSONtoString = (object) => {     
    var results = [];
    // var object = this.state.search;
    for (var property in object) {
        var value = object[property];
        if (value){
            results.push( `"${property.toString()}": "${value.toString().trim()}"`);
        }
      }                
    return '{' + results.join(', ') + '}';
  }

  const handleErrorModal = async (code,errors) => {// (code,error){
    
    setLoading(false)
    console.log("+++ERROR+++")
    console.log(code)
    console.log(errors)

    if(code === 400){ 
      if(open){
        setErrorModal(errors);
      }else{
        if(Object.keys(errors).length > 0){
          try { await commonActions.setCommonError(errors[Object.keys(errors)[0]]); } catch (e) { console.log(e); } //handleErrorModal 첫번째 key의 value 가져오기.. 공통 사용가능
        }
      }
    }else{
      // const { commonActions } = this.props;
      try { await commonActions.setCommonError(errors.message); } catch (e) { console.log(e); }
    }
     onCloseConfirmModal();
     setLoading(false)
  }


  const handleLoadExcel = async (e) => {
    var query = encodeURI(JSONtoString(search));
    let envUrl = process.env.BACKEND_SERVER;
    const token = sessionStorage.getItem('token');
    
    var jqxhr = $.ajax(envUrl +"/excel/company/school/student?token="+token+"&query="+query)
    .done(function(status) {
      console.log("<< Excel DONE status >> ");
      window.open(envUrl +"/excel/company/school/student?token="+token+"&query="+query, '_blank');
    }) 
    .fail(function(xhr, status, errorThrown) {       
      console.log("<< Excel FAIL status >> ");
      
      if(xhr.responseJSON.errors["message"]){ // RETURN 에러 메시지 처리 
        commonActions.setCommonError(xhr.responseJSON.errors["message"]);
      }
    })
    .always(function() {});
  }

 const  handleLoad = async (gubun) => { //교육조회

    console.log("###### handleLoad + 교육조회 ######");
    // console.log(tabId)
    console.log(search)

    // if(tabId){
    //   var query = this.JSONtoString({trainingType:tabId});
    //   }else{
    var query = JSONtoString(search); // }
      
    console.log("query")
    console.log(query)
    setLoading(true);

    try {
      axios.get( URL_PATH ,{ params: { query: query } })
      .then( (response) => {
        console.log("### handleLoad ###");
        console.log(response.data.data);
       // this.setState({ list : response.data});
       setList({listItems:response.data})
       setOptionInit(gubun);
       setLoading(false);
      })
      .catch( (error) => {
        console.log("error handleLoad");
        console.log(error);
        setLoading(false);
      });

    } catch (e) {
      console.log(e);
    }
  }

  const handleInsert = async () => {

    //const { selected } = this.state; 
    console.log("datas handleInsert #######################");
    console.log( selected );

    setLoading(true);

    const formData = new FormData();
    const config = {
      headers: {
        'Accept': 'application/json',
        'content-type': 'multipart/form-data',
        // 'content-type': 'application/x-www-form-urlencoded'
      }
    }

    if(selected.hasOwnProperty("filePath") && selected.filePath!=="" && selected.filePath !== null){

      console.log('############################# handleInsert+ handleInsert');

      for(var i=0;i<selected.filePath.length;i++){
          formData.append('file',selected.filePath[i]); 
        }

      // formData.append('file', selected.filePath[0]); 
      const onlnyData = Object.assign({},selected); // selected 복사
      delete onlnyData.filePath;

      formData.append('data', JSON.stringify(selected));
      
    }else{
      
      // console.log(key)
      console.log(selected)
      formData.append('data', JSON.stringify(selected));
    }

    axios.post(URL_PATH_INSERT, formData, config)
                .then( (response) => {
                  console.log("### handleInsert ###");
                  console.log(response.data.data);
                  //this.onCloseModal();
                  setOpen(false);
                  handleLoad();
                  setLoading(false);
                })
                .catch( (error) => {
                  console.log("error");
                  console.log(error);
                  if(error.response && error.response.data.code){
                      let code = error.response.data.code;
                      let errors = error.response.data.errors;
                     handleErrorModal(code,errors);
                  }
                  setLoading(false);
                });
  }

  const handleUpdate = async () => {

    //const { selected } = this.state;
    console.log("datas handleUpdate #######################");
    console.log( selected );

    setLoading(true);

    const formData = new FormData();
    const config = {
      headers: {
        'Accept': 'application/json',
        'content-type': 'multipart/form-data',
        // 'content-type': 'application/x-www-form-urlencoded'
      }
    }

    if(selected.hasOwnProperty("filePath") && selected.filePath!=="" && selected.filePath !== null){

      console.log('############################# handleUpdate handleInsert');
      console.log(selected.filePath.length)
      for(var i=0;i<selected.filePath.length;i++){
        // console.log("inout")
        // console.log(selected.filePath[i])
          formData.append('file',selected.filePath[i]); 
        }

      const onlnyData = Object.assign({},selected);
      delete onlnyData.filePath;

      formData.append('data', JSON.stringify(selected));
      
    }else{
      formData.append('data', JSON.stringify(selected));
    }

   return axios.put(URL_PATH_UPDATE, formData, config)
                .then( (response) => {
                  console.log("### handleUpdate ###");
                  console.log(response.data.data);
                  setLoading(false);
                  setOpen(false);
                })
                .catch( (error) => {
                  console.log("error");
                  console.log(error.response);
                  if(error && error.response && error.response.data.code){
                    let code = error.response.data.code
                    let errors = error.response.data.errors
                    handleErrorModal(code,errors);
                  }
                });
          }

  const handleDelete = async () => { // handleDelete - 삭제 (selected.키값)

    try {
      setLoading(true);
      axios.delete(URL_PATH_DELETE  + '/' + selected.trainingSeqId , {})
      .then( (response) => {
        onCloseModal();
        onCloseConfirmModal();
        setLoading(false);
        handleLoad(true);
      })
      .catch( (error) => {
        console.log("error");
        console.log(error);
        if(error && error.response && error.response.data.code){
          let code = error.response.data.code
          let errors = error.response.data.errors
          handleErrorModal(code,errors);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  
   const handleLoadAPPRL = async (datas) => { 


    let trainingSeqId;
    if(datas && datas.trainingSeqId){
      trainingSeqId = datas.trainingSeqId
    }
    console.log(datas)

    try {
      var query = JSONtoString(search);

      setLoading(true);

      axios.get( URL_PATH_APPRL ,{ params: { query: query } })
      .then( (response) => {
  
        let listAPPRL = response.data.data;
        let standAPPRL = Object.assign([], listAPPRL); // 승인대기 list
        // console.log(">>>>>>>>>standAPPRL>>>>>>>")
        // console.log(standAPPRL)
        standAPPRL = standAPPRL.filter(
          standAPPRL => (standAPPRL.trainingSeqId === trainingSeqId )
        )
        setModalStandAPPRL({data:standAPPRL});
       // const [modalStandAPPRL, setModalStandAPPRL] = useState({ },[]);

       setLoading(false);
      })
      .catch( (error) => {
        console.log("error");  
        console.log(error);
        loading (false);
      });

    } catch (e) {
      console.log(e);
    }
  }

  const handleUpdateAPPRL = async (datas) => { 
    //update분리 필요
    console.log("datas▷▷▷▷▷")
    console.log(datas)

    // console.log("datas handleUpdateAPPRL #######################");
    // console.log( selected );
    if(datas.hasOwnProperty("registerStatus") && datas.registerStatus === "H"){
      datas["registerStatus"] = "T";
    }
    else if(datas.hasOwnProperty("registerStatus") && datas.registerStatus === "T"){
      datas["registerStatus"] = "H";
    }
    else if(datas.hasOwnProperty("registerStatus") && datas.registerStatus === "D"){
      datas["registerStatus"] = "F";
    }

    try {
      setLoading(true);
      axios.put(URL_PATH_APPRL , datas)
      .then( (response) => {
        console.log("### handleUpdateAPPRL ###");
        console.log(response.data.data);
       handleLoadAPPRL(datas);
       setLoading(false);
      })
      .catch( (error) => {
        console.log("error");
        console.log(error);
        if(error && error.response && error.response.data.code){
          let code = error.response.data.code
          let errors = error.response.data.errors
          handleErrorModal(code,errors);
        }
        loading(false);
      });

    } catch (e) {
      console.log(e);
    }
  }


  // handleUpdateCancle = async (datas) => { //>>20191023 현기준 안씀
  //   //update분리 필요
  //   const { selected } = this.state;
  //   console.log("datas▷▷▷▷▷")
  //   console.log(datas)

  //   console.log("datas handleUpdateCancle #######################");
  //   console.log( selected );
  //   if(datas.hasOwnProperty("registerStatus") ){
  //     datas["registerStatus"] = "D";
  //   }
  //   console.log("handleupdate datas")
  //   console.log(datas)

  //   try {
  //     axios.put(URL_PATH_APPRL , datas)
  //     .then( (response) => {
  //       console.log("### handleUpdateCancle ###");
  //       console.log(response.data.data);
  //       this.onSearch2();
  //       // this.handleLoadAPPRL();
  //       // this.onCloseModal();
  //     })
  //     .catch( (error) => {
  //       console.log("error");
  //       console.log(error);
  //       let code = error.response.data.code
  //       let errors = error.response.data.errors
  //       this.handleErrorModal(code,errors);
  //     });

  //   } catch (e) {
  //     console.log(e);
  //   }
  //   setLoading(true);
  //   setTimeout(() => this.setState({ loading: false }), 200);
  // }

    //let { duplicate } = this.props;

    //let listItems = this.state.list;

    // if (listItems && listItems !== null) {
    //   if (listItems.data && listItems.data !== null) {
    //     listItems.data.forEach((obj, i) => {
    //       obj["no"] = i + 1;
    //     });
    //   }
    // }

    // console.log("CODES>>>>>>>>>>>")
    // console.log(CODES)
    
    // console.log(this.props.pages.data.commons);
    const listCommons = pages && pages.data && pages.data.commons? pages.data.commons:{};
    let searchTab = listCommons && listCommons[CODES.comEduGubnKey] ? listCommons[CODES.comEduGubnKey] : "";
    //let onClickTab = onClickTab;

    const options = {
      //"ajax": 'assets/api/tables/customizetables.standard.json',
      // "ajax": require('app/config/customizecontentgrid.json'),
      "ajax": list.listItems,  //this.props.list,
      "iDisplayLength": 10,
      "columns": [
        // { "visible": true, "type": "checkbox", "id": "chk", "name": "선택", "sorttype": false},
        { "visible": true, "type": "readonly", "align": "center", "id": "no", "name": "No.", "sorttype": "num" },
        { "visible": true, "type": "readonly", "align": "center", "id": "trainingType", "name": "교육구분", "sorttype": "text", "comCode": CODES.comEduGubnKey, "coms": listCommons },
        { "visible": true, "type": "readonly", "align": "center", "id": "targetName", "name": "교육대상", "sorttype": "text" },
        { "visible": true, "type": "readonly", "align": "center", "id": "trainingTitle", "name": "교육명", "sorttype": "text" },
        { "visible": true, "type": "period",   "id": "startDate",   "id2": "endDate",  "name": "교육기간", "sorttype": "text"},//기간~
        { "visible": true, "type": "readonly", "align": "center", "id": "trainingName", "name": "교육담당자", "sorttype": "text" },
        { "visible": true, "type": "readonly", "align": "center", "id": "trainingPlace", "name": "교육장소", "sorttype": "text" },
        // { "visible": true, "type": "readonly", "align": "center", "id": "enabled", "name": "상태", "sorttype": "text", "comCode": CODES.comEnrollKey, "coms": listCommons},
        { "visible": true, "type": "popup", "align": "center", "id": "approvedCnt","id2":"unapprovedCnt", "name": "신청인원", "sorttype": "num" 
          , "function": handleRowClick } // 신청인원 : unapprovedCnt / approvedCnt
      ],
      "viewable": false,
      "order": ["no", "asc", "num"],
      "excelable": false,
      "printable": false,
      "dispable": false,
      "iDisplay": ["50", "100", "150"]
    }

    
        //날짜 default 옵션 셋팅
        var today = new Date();
        var currDay = new Date();

        let year = today.getFullYear();
        let cMonth = today.getMonth()+1;
        cMonth = cMonth >= 10 ? cMonth : '0' + cMonth;
        let lastDate = new Date(today.getFullYear(),today.getMonth()+1,0);
        lastDate = lastDate.getDate();//해당 월의 마지막 날짜
        let Mdate = year.toString() + cMonth.toString() +lastDate.toString();//년+월+일 string으로 변환후 합침
    
    const optionsX = [
      // { "formatter": "select", "name": "trainingTitle", "labelName": "교육명" , "comCode": CODES.comEduGubnKey, "coms": listCommons },
      { "formatter": "input", "name": "trainingTitle", "labelName": "교육명" , "type":"text", "desc":"교육명 입력", "comCode": CODES.comEduGubnKey, "coms": listCommons },
      { "formatter": "date2", "labelName": "교육기간"
        , "name": "searchStartDate", "desc":"시작일" ,"default": currDay.setMonth(today.getMonth() - 1) //한달전
        , "name2": "searchEndDate", "desc2":"종료일" ,  "default2":Mdate
        , "button": [{"today": true}, {"yesterday": true}, {"week": true}, {"month1": true}, {"month": true}, {"month6": true}, {"year": true}]
        , "buttonName": 
                  [{"today": "오늘"}, {"yesterday": "어제"}, {"week": "일주일전"}, {"month1": "한달전"}, {"month": "이번달"}, {"month6": "6개월전"}, {"year": "일년전"}]
      }
    ];  
    console.log("contoaner selected")
    console.log(selected)
    
    return (
      <React.Fragment>
        <Loading flag={loading} />

        {/*<!-- Title widget -->*/}
        <ContentWidget titleName={<FormattedMessage id="MED001" />/* 교육등록관리 */} >
          <button type="submit" className={"btn btn-success"} onClick={onOpenModal}><FormattedMessage id="Registration" /></button>
        </ContentWidget>

        {/*<!-- Search Box -->*/}
        <ContentXearch
          subTitle={true}
          searchButton={true}
          optionsX={optionsX}
          onSearch={onSearch}
           onChange={(e) => setSearch({
            ...search,
            search : search[e.target.name] = e.target.value
          })}
           onSearch={() => handleLoad(true)} />

          <div className="col clo-12 w100 grid_top_wrap" style={{height : "100%"}}>
              <div className="jarviswidget-ctrls jarvis_btn fLeft category_tab_btn w100"  role="menu">
              <a className="col col-xs-6 col-sm-3 col-md-2 col-lg-2 btn btn-success fLeft active" id="" onClick={onClickTab} >전체보기</a>
                { searchTab && searchTab ? searchTab.map(function(sear,i){
                    return <a key={i} className="col col-xs-6 col-sm-3 col-md-2 col-lg-2 btn btn-success fLeft" id={sear.key} onClick={onClickTab} >{sear.value}</a>
                  }) :"" }
              <button onClick={handleLoadExcel} className={"btn btn-success fLeft"}>Excel</button>
              </div>
          </div>

        {/*<!-- Grid Content -->*/}
        <ContentTable
          paginationUse={true}
          currentPage={currentPage}
          onChangePage={onChangePage}
          onRowDoubleClick={handleRowDoubleClick}
          options={options}
          optionInit = {optionInit}
          />

        {/* 삭제 컨펌 모달 팝업 */} 
        <ConfirmModal 
          show={openConfirm}
          name={"openConfirm"}
          title={"교육삭제 확인"}
          confirmName={selected.trainingTitle}
          onDeleteModal={handleDelete}
          onCloseModal={onCloseConfirmModal}
        />

        {/* 등록 모달 팝업 */}
        <EnrollEduModal
          show={open}
          mode={mode}
          listCommons={listCommons}
          data={selected}
          name={"open_class_info"}
          errors={errorModal}
          //duplicate={duplicate}
          //onSearchCode={handleLoadCodeConfirm}
          //onSearchCodeReturn={handleLoadCodeConfirmReturn}
          onChange={onChangeModal}
          onInsert={handleInsert}
          onUpdate={handleUpdate}
          onDelete={onOpenConfirmModal}
          onClose={() => {setOpen(false) ; setErrorModal("") ; handleLoad(false);}}
          />

        {/* 승인관리 팝업 */}
        <EduApprovalModal
          show={openAPPRL}
          mode={mode}
          listCommons={listCommons}
          gridData = {modalStandAPPRL}  //모달 위 그리드 ---> 승인관리 조회
          // gridData2 = {this.state.modalCompltAPPRL} //모달 아래 그리드 --->승인완료 조회
          // data = {this.state.selected}
          gridSelectData = {gridSelectData} 
          data = {selected}
          name={"open_eduapproval_info"}
          currentPageModal={currentPageModal}
          currentPageModalSelect={currentPageModalSelect}
          onChangePageModal={onChangePageModal}
          onChangePageModalSelect ={(val) => setPageModal2(val)}
          errors={errorModal}
          onSearch={(e) =>{setPageModal(1);setPageModal2(1); handleLoad3(true,e)}}
          // onChangeTable={this.onChangeModalTable}
          // onClickAdd={this.handleRowClickModalAdd}
          // onClickDel={this.handleRowClickModalDel}
          onChange={(e) =>{ 
            console.log("###onChange")
            console.log(e)
            console.log(search2)
            setSearch2({
              ...search2,
              search2 : search2[e.target.name] = e.target.value
            })
          }}
          onInsert={handleInsert} 
          onUpdate={handleUpdateAPPRL}
          onDelete={handleDelete} // onUpdateCancle={this.handleUpdateCancle}ete}
          onClose={onCloseAPPRL} />
          
      </React.Fragment>
    );
  }

export default connect(
  (state) => ({
    list: state.education.getIn(['list', 'data']),
    list2: state.education.getIn(['list2', 'data']),
    status: state.education.get('status'),
    searchError: state.education.getIn(['list', 'errors']),
    error: state.education.get('error'),
    pages: state.common.getIn(['list2', 'data']),
  }),
  (dispatch) => ({
    SOrderActions: bindActionCreators(SOrderActions, dispatch),
    educationActions: bindActionCreators(educationActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  })
)(withRouter(EnrollEduContainer2));