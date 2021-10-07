import React, { Component } from 'react';
import $ from 'jquery';
// import styles from 'index.scss';
// import classNames from 'classnames/bind';
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

class EnrollEduContainer extends Component {

  constructor() {
    super();

    this.state = {
      open: false,
      openConfirm: false,
      openAPPRL: false,
      mode: null,
      // currentPage: 1,
      selected: {},
      selected2: {},
      gridSelectData : {},
      currentPage: 1,
      currentPageModal: 1,
      currentPageModalSelect: 1,
      search: {},
      searchCommon: {},
      loading: false,
      error: null,
      status: 'ready',
      modalList :{}, //modal list
      tabId:"",
      errorModal:null ,
      optionInit : false

    };

    this.onChange = this.onChange.bind(this);
    this.onChangeModal = this.onChangeModal.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSearch2 = this.onSearch2.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);

    this.onChangePage = this.onChangePage.bind(this);
    this.onChangePageModal = this.onChangePageModal.bind(this);
    this.onChangePageModalSelect = this.onChangePageModalSelect.bind(this);


    this.handleLoad = this.handleLoad.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.handleLoadAPPRL = this.handleLoadAPPRL.bind(this);
    this.handleUpdateAPPRL = this.handleUpdateAPPRL.bind(this);

    // this.handleUpdateCancle = this.handleUpdateCancle.bind(this);

    this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.onClickTab = this.onClickTab.bind(this);

    this.handleErrorModal = this.handleErrorModal.bind(this);

  }

  componentDidMount() {
    this.handleLoad(false);
    this.handleLoadAPPRL();
  }

  componentWillReceiveProps(nextProps) {

    //console.log('##### componentWillReceiveProps #####');

    let history = nextProps.history;

    if (nextProps.loginResult && nextProps.loginResult.data) {
      history.push('/main');
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log('##### shouldComponentUpdate #####');
    //console.log(nextProps);

    if (nextProps.status && nextProps.status === "refresh") {
      // this.handleLoadCommon();
      // this.onCloseModal();
      // const { educationActions } = this.props;
      // educationActions.setStatus();
      // this.onSearch();
      return true;
    }
    return true;
  }

  handleRowClick = (datas) => {
    this.setState({selected: {} });
    this.setState({ optionInit : false });
    //console.log('##### ##### ##### onClickRow ##### ##### #####');    
    //console.log('##### ##### ##### datas ##### ##### #####');
    //console.log(datas);

    this.setState({ openAPPRL: true });
    this.setState({ mode: 'create' });
    this.setState({selected:datas});

    this.handleLoadAPPRL(datas)

  }

  handleRowDoubleClick = (datas) => {
    //console.log('##### ##### ##### handleRowDoubleClick ##### ##### #####');    
    //console.log('##### ##### ##### datas ##### ##### #####');
    //console.log(datas);

    this.setState({ open: true });
    this.setState({ mode: 'detail' });
    this.setState({ selected: datas });
    this.setState({ optionInit :false });
  }

  /* handleRowClickModalAdd = (datas) => { 
    console.log('##### ##### ##### handleRowClickModalAdd ##### ##### #####');    
    console.log('##### ##### ##### datas ##### ##### #####');
    console.log(datas);
    console.log(this.state.selected2);
    
    let nDatas = datas;
    nDatas["no"] = 1;

    //data selected2에 셋팅하기 !! redux 다이렉트 연결 하면 안됨 !!
    let list2 = this.state.selected2; // new or 값 있음...
    let templist2 = {};
    templist2["data"] = [];

    if(list2 && list2.data && list2.data !== null){
        list2.data.forEach( (obj, i) => {
          if(obj){
            obj["no"] = i+1;
          }
          templist2.data.push(obj);
        });
    }
    console.log("templist2")
    console.log(templist2)


    let sRow = templist2.data ? Object.keys(templist2.data).length : 0; //selected2 Row 갯수 - 행의 수 : sRow , no 셋팅 : sRow+1
    const newDatasSeqid = datas.seqid; // + 선택한 발주상세정보의 orderCode // 기준

    let same = ""; //boolean 체크용 - 최초 구분값
    let compare = ""; //boolean 체크용 - 중간 구분값
    let change = ""; //boolean 체크용 - 끝 구분값
    let changeGubn = false; //boolean 체크용 - 최종 구분값  => 추가 할지 여부
    

      if(sRow > 0){
        if(templist2 && templist2.data && templist2.data !== null){
          templist2.data.map( (obj, i) => {

            if(obj.seqid === newDatasSeqid){
              same = true; //같은 값 있는지 boolean 체크용
            }
            if(obj.seqid !== newDatasSeqid){
              same = false;
            }

            if(same){ //같은 값 있는지 boolean 체크용 - ( same : true -> compare : true )
              compare = true;
            }else{
              compare = false;
            }

            if(change || compare){ //같은 값 있는지 boolean 체크용 - ( 이전 flag change : true -> 현재 compare : true )
              change = true;
              changeGubn = false; //같은 값 있는지 boolean 체크용 - 같은값 있으면 ADD 안함
            }else{
              change = false;
              changeGubn = true; //같은 값 있는지 boolean 체크용 - 같은값 없으니 ADD
            }
            
          }, this);
        }
      }else{
        changeGubn = true;// 신규 add
      }
      console.log("changeGubn ■■■■■■■■■■■■■■■■■■■■■■■■■ ")
      console.log(changeGubn)
      if(changeGubn){
        templist2.data.push(nDatas);
        this.setState({selected2: templist2});
      }

    console.log('##### ##### ##### datas input this.state.selected2 ##### ##### #####');
    console.log(this.state.selected2);
    
    // intsert 시 selected2로 handleinsert
    // selected2
    // this.handleInsertAPPRL();
  } */

  /* handleRowClickModalDel = (datas) => { //모달 삭제버튼 클릭 이벤트 < buttonDel >
    // console.log('##### ##### ##### handleRowClickModalDel ##### ##### #####');    
    // console.log('##### ##### ##### datas ##### ##### #####');
    // console.log(datas);

    let changeGubn = false; //추가 할지 여부
    let arrayGubn = -1; //몇번째 행인가 체크 용
    let gubn = false; //boolean 체크용 - 최종구분값
    const newDatasSeqid = datas.seqid; // + 선택한 발주상세정보의 orderCode // 기준
    let newSelected2 = this.state.selected2; //주문상품list 선택확인 한 현황

    let sRow = newSelected2.data ? Object.keys(newSelected2.data).length : 0; //selected2 Row 갯수 - 행의 수 : sRow , no 셋팅 : sRow+1

      if(newSelected2 && newSelected2.data && newSelected2.data !== null){
          // nnnnn = newSelected2.data.map( (obj, i) => {
          newSelected2.data.map( (obj, i) => {
            if(obj.seqid === newDatasSeqid){
              changeGubn = false;// console.log("같은 orderCode"); !!! !!! !!! 다르면 추가시킴 !!! !!! !!!
              gubn = true; //같은 값 있는지 boolean 체크용
            }
            if(obj.seqid !== newDatasSeqid){
              changeGubn = true;// console.log("다른 orderCode");
              gubn = false; //같은 값 있는지 boolean 체크용
            }

            if(gubn){ //같은 값 있는지 boolean 체크용
              changeGubn = true; // console.log("같은값 있으니깐 브레이크 필요 리턴값 : false"); // 최종 구분값 
              // arrayGubn = i; //삭제할 행 배열위치값
              arrayGubn = obj.seqid; //삭제할 행 orderCode
            //   return null;
            // }else{
            //   return obj;
            }
          }, this);
      }

      console.log()

    let newDatas2 = {}; // newDatas2 (-) 선택한 주문상품list 선택확인 한 현황
    // if(this.state.selected){ // 신규등록이므로 체크할 selected 없음 
      // stuentSeqid = this.state.selected["studentSeqid"];
      if(changeGubn){      
        if(newSelected2.data){
            // newDatas2 (-) 선택한 주문상품list 선택확인 한 현황
            newDatas2 = newSelected2.data
              .filter(data => data.seqid !== arrayGubn) //삭제할 행 orderCode
              .map(obj=>obj); 

            console.log("--------------------sRow  SOrder");
            console.log(sRow);

            if(sRow===1){
              newSelected2.data = [];
            }else{
              newSelected2.data = newDatas2;
            }

            this.setState({selected2: newSelected2 });
        }
      }
    // }
    this.onSearch2();
    this.handleDeleteAPPRL();
  } */


  onChangePage(val) {
    console.log('##### onChangePage #####' , val);
    this.setState({ currentPage: val });
    this.setState({ optionInit : false});
  }
  onChangePageModal(val) {
    console.log('##### onChangePageModal #####' , val);
    this.setState({ currentPageModal: val });
    // this.state.currentPageModal = val;
  }
  onChangePageModalSelect(val) {
    console.log('##### onChangePageModalSelect #####' , val);
    this.setState({ currentPageModalSelect: val });
    // this.state.currentPageModalSelect = val;
  }

  onChange(e) {
    // console.log('##### onChange  ' + e.target.name + ':' + e.target.value);
    const newSearched = this.state.search;

    let value = "";
    if (e.target.value !== "") value = e.target.value;

    newSearched[e.target.name] = value;
    this.setState({ search: newSearched });
    //this.setState({[e.target.name]: e.target.value});
  }

  onChange2(e) {
    
    console.log('##### onChange2  ' + e.target.name + ':' + e.target.value);
    const newSearched = this.state.search2;

    let value = null;
    if(e.target.value!=="") value = e.target.value;

    newSearched[e.target.name] = value;
    this.setState({search2 : newSearched});
    //this.setState({[e.target.name]: e.target.value});
  }

  onChangeModal = (e)=> {
    
    //console.log('##### onChangeModal this.state.selected  ::: ' + this.state.selected);
    // console.log('##### onChangeModal  ' + e.target.name + ':' + e.target.value);

    // e.persist();
    const newSelected = this.state.selected;

    // newSelected[e.target.name] =e.target.value;

    if(e.target.files){
      // console.log("e.target.files 자료실")
      console.log(e.target.files)
      if(e.target.files){
        newSelected[e.target.name] = e.target.files;
        // console.log("newSelected 자료실")
        // console.log(e.target.name)
        // console.log(newSelected)
      }
    }
    else{
      
      newSelected[e.target.name] = e.target.value;
    }

    this.setState({selected : newSelected});    
    console.log(">>>>>>>>")
    console.log(this.state.selected)
    //this.setState({ ...selected, [e.target.name]: e.target.value});
  }

  onClickTab= async (e) => {
    e.persist();
    // let search = this.state.search;
    // this.state.search["trainingTitle"] = ""; //
    
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

    this.state.search["trainingType"] = tabId;

    this.handleLoad(true);
    this.setState({currentPage: 1});
  }

  onSubmit(e) {
    e.preventDefault();
  }

  onSearch() {
    console.log('####### onSearch #######');
    this.setState({currentPage: 1});
    this.handleLoad(true);
    
  }
  onSearch2() {
    // console.log('####### onSearch2 -> handleLoad2 #######');
    this.setState({currentPageModal: 1});
    this.setState({currentPageModalSelect: 1});    
    this.handleLoadAPPRL();
  }

  onSearchInit() {
    console.log('####### onSearchInit #######');
    console.log(this.state.search);

    // const newSearched = this.state.selected;

    // newSearched[ e.target.name] = e.target.value;
    // this.setState({search : newSearched});

    const newSearch = {};
    this.setState({ search: newSearch });
    console.log(this.state.search);
  }

  /* callback함수 callbackModal - onClose */
  onClose(e) {

    console.log('##### onClose Modal #####');

    const modalFlag = {};
    modalFlag[e.target.name] = e.target.value;
    console.log(modalFlag);
    this.setState(modalFlag);

    this.onSearch();

  }

  onOpenModal(e) {
    e.preventDefault();

    this.setState({ optionInit : false});

    this.setState({ open: true });
    this.setState({ mode: 'create' });
    console.log("this.state.search")
    console.log(this.state.search)
    const newSelected = {};
    newSelected["trainingType"] = this.state.search && this.state.search.trainingType?this.state.search.trainingType:"";  //선택한 카테고리 값 부여
    // newSelected["targetBranch"] = "T";
    // newSelected["targetSchool"] = "T";   // default공지대상 체크
    // newSelected["calendarCheck"] = "T";  // default일정 체크
    

    this.setState({ selected: newSelected });
  }

  onCloseModal = () => {
    this.setState({ open: false });
    this.setState({ errorModal : "" })
    this.handleLoad(false);
    // this.onSearch();
  };

  onCloseAPPRL = () => {
    this.setState({ openAPPRL: false });
    this.handleLoad(false);
    // this.onSearch();
  };

  onOpenAPPRL(e) {
    e.preventDefault();
    this.onSearch2();

    this.setState({ openAPPRL: true });
    this.setState({ mode: 'create' });
    this.setState({ selected: {} });
  }

  onOpenConfirmModal = () => { 
    console.log("##### onOpenConfirmModal #####"); 
    this.setState({ openConfirm: true });
  }
  
  onCloseConfirmModal = () => { 
    console.log("##### onCloseConfirmModal #####"); //컨펌 창 close
    this.setState({ openConfirm: false });
  }


  JSONtoString = (object) => {
    var results = [];
    // var object = this.state.search;
    for (var property in object) {
      var value = object[property];
      if (value) {
        // results.push(property.toString() + ': ' + value.toString());
            // results.push( "\""+property.toString()+"\"" + ": " + "\""+value.toString().trim()+"\"");
            results.push( `"${property.toString()}": "${value.toString().trim()}"`);
      }
    }
    return '{' + results.join(', ') + '}';
  }

  handleErrorModal = async (code,errors) => {// (code,error){
    console.log("+++ERROR+++")
    console.log(code)
    console.log(errors)
    this.setState({ loading : false });

    const { commonActions } = this.props;
    if(code === 400){ 
      if(this.state.open){
        this.setState({ errorModal : errors });
      }else{
        if(Object.keys(errors).length > 0){
          try { await commonActions.setCommonError(errors[Object.keys(errors)[0]]); } catch (e) { console.log(e); } //handleErrorModal 첫번째 key의 value 가져오기.. 공통 사용가능
        }
      }
    }else{
      // const { commonActions } = this.props;
      try { await commonActions.setCommonError(errors.message); } catch (e) { console.log(e); }
    }
    this.onCloseConfirmModal();
  }


  handleLoadExcel = async (e) => {
    let query = encodeURI(this.JSONtoString(this.state.search));

    let envUrl = process.env.BACKEND_SERVER;
    const token = sessionStorage.getItem('token');
    
    const { commonActions } = this.props;

    var jqxhr = $.ajax(envUrl +"/excel/company/education?token="+token+"&query="+query)
    .done(function(status) {
      console.log("<< Excel DONE status >> ");
      //체크 완료시 실행 Excel
      window.open(envUrl +"/excel/company/education?token="+token+"&query="+query, '_blank');
    }) 
    .fail(function(xhr, status, errorThrown) {       
      console.log("<< Excel FAIL status >> ");
      
      if(xhr.responseJSON.errors["message"]){ // RETURN 에러 메시지 처리 
        commonActions.setCommonError(xhr.responseJSON.errors["message"]);
      }
    })
    .always(function() {}); // console.log("<< Excel ALWAYS FIRST status >> ");

    // jqxhr.always(function() { console.log("<< Excel ALWAYS Second status >> "); });

  }

  handleLoad = async (gubun) => { //교육조회

    console.log("###### handleLoad + 교육조회 ######");
    // console.log(tabId)
    console.log(this.state.search)

    // if(tabId){
    //   var query = this.JSONtoString({trainingType:tabId});
    //   }else{
    var query = this.JSONtoString(this.state.search); // }
      
    console.log("query")
    console.log(query)
    try {
      axios.get( URL_PATH ,{ params: { query: query } })
      .then( (response) => {
        console.log("### handleLoad ###");
        console.log(response.data.data);
        this.setState({ list : response.data});
        this.setState({ optionInit :gubun });
      })
      .catch( (error) => {
        console.log("error handleLoad");
        console.log(error);
      });

    } catch (e) {
      console.log(e);
    }

    this.setState({ loading: true });
    setTimeout(() => this.setState({ loading: false }), 200);
  }

  handleInsert = async () => {

    const { selected } = this.state;
    console.log("datas handleInsert #######################");
    console.log( selected );

    this.setState({ loading: true });

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
                  this.setState({ "open": false });
                  this.onSearch();
                  this.setState({ loading: false });
                })
                .catch( (error) => {
                  console.log("error");
                  console.log(error);
                  if(error.response && error.response.data.code){
                      let code = error.response.data.code;
                      let errors = error.response.data.errors;
                      this.handleErrorModal(code,errors);
                  }
                  this.setState({ loading: false });
                });
  }

  handleUpdate = async () => {

    const { selected } = this.state;
    console.log("datas handleUpdate #######################");
    console.log( selected );

    this.setState({ loading: true });

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
                  this.onCloseModal();
                  this.setState({ loading: false });
                })
                .catch( (error) => {
                  console.log("error");
                  console.log(error.response);
                  if(error && error.response && error.response.data.code){
                    let code = error.response.data.code
                    let errors = error.response.data.errors
                    this.handleErrorModal(code,errors);
                  }
                });
  }

  handleDelete = async () => { // handleDelete - 삭제 (selected.키값)

    const { selected } = this.state;

    //console.log("datas deleted #######################");
    //console.log({ selected });

    try {
      this.setState({ loading: true });
      axios.delete(URL_PATH_DELETE  + '/' + selected.trainingSeqId , {})
      .then( (response) => {
        this.onCloseModal();
        this.onCloseConfirmModal();
        this.setState({ loading: false });
      })
      .catch( (error) => {
        console.log("error");
        console.log(error);
        this.handleErrorModal();
      });
    } catch (e) {
      console.log(e);
    }
  }

  
   handleLoadAPPRL = async (datas) => { 


    let trainingSeqId;
    if(datas && datas.trainingSeqId){
      trainingSeqId = datas.trainingSeqId
    }
    console.log(datas)

    try {
      var query = this.JSONtoString(this.state.search);

      this.setState({ loading: true });

      axios.get( URL_PATH_APPRL ,{ params: { query: query } })
      .then( (response) => {
        // console.log("### handleLoadAPPRL 22###");
        // console.log(response.data.data);
        // console.log(response.data);

        let listAPPRL = response.data.data;
        let standAPPRL = Object.assign([], listAPPRL); // 승인대기 list
        // console.log(">>>>>>>>>standAPPRL>>>>>>>")
        // console.log(standAPPRL)
        standAPPRL = standAPPRL.filter(
          standAPPRL => (standAPPRL.trainingSeqId === trainingSeqId )
        )
        this.setState({ modalStandAPPRL : {data:standAPPRL}});
        this.setState({ loading: false });
      })
      .catch( (error) => {
        console.log("error");
        console.log(error);
        this.setState({ loading: false });
      });

    } catch (e) {
      console.log(e);
    }
  }

  handleUpdateAPPRL = async (datas) => { 
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
      this.setState({ loading: true });
      axios.put(URL_PATH_APPRL , datas)
      .then( (response) => {
        console.log("### handleUpdateAPPRL ###");
        console.log(response.data.data);
        this.handleLoadAPPRL(datas);
        this.setState({ loading: false });
      })
      .catch( (error) => {
        console.log("error");
        console.log(error);
        if(error && error.response && error.response.data.code){
          let code = error.response.data.code
          let errors = error.response.data.errors
          this.handleErrorModal(code,errors);
        }
        this.setState({ loading: false });
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
  //   this.setState({ loading: true });
  //   setTimeout(() => this.setState({ loading: false }), 200);
  // }


  render() {


    const { open, mode, currentPage, openAPPRL } = this.state;

    let { duplicate } = this.props;

    let listItems = this.state.list;

    if (listItems && listItems !== null) {
      if (listItems.data && listItems.data !== null) {
        listItems.data.forEach((obj, i) => {
          obj["no"] = i + 1;
        });
      }
    }

    // console.log("CODES>>>>>>>>>>>")
    // console.log(CODES)
    
    // console.log(this.props.pages.data.commons);
    const listCommons = this.props.pages && this.props.pages.data && this.props.pages.data.commons ? this.props.pages.data.commons : {};
    let searchTab = listCommons && listCommons[CODES.comEduGubnKey] ? listCommons[CODES.comEduGubnKey] : "";
    let onClickTab = this.onClickTab;

    const options = {
      //"ajax": 'assets/api/tables/customizetables.standard.json',
      // "ajax": require('app/config/customizecontentgrid.json'),
      "ajax": listItems,  //this.props.list,
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
          , "function": this.handleRowClick } // 신청인원 : unapprovedCnt / approvedCnt
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
      { "formatter": "input", "name": "trainingTitle", "labelName": "교육명" , "desc":"교육명 입력", "comCode": CODES.comEduGubnKey, "coms": listCommons },
      { "formatter": "date2", "labelName": "교육기간"
        , "name": "searchStartDate", "desc":"시작일" ,"default": currDay.setMonth(today.getMonth() - 1) //한달전
        , "name2": "searchEndDate", "desc2":"종료일" ,  "default2":Mdate
        , "button": [{"today": true}, {"yesterday": true}, {"week": true}, {"month1": true}, {"month": true}, {"month6": true}, {"year": true}]
        , "buttonName": 
                  [{"today": "오늘"}, {"yesterday": "어제"}, {"week": "일주일전"}, {"month1": "한달전"}, {"month": "이번달"}, {"month6": "6개월전"}, {"year": "일년전"}]
      }
    ];

    // console.log("삭제 확인 셀렉");
    // console.log(this.state.selected)
    
    
    return (
      <React.Fragment>
        <Loading flag={this.state.loading} />

        {/*<!-- Title widget -->*/}
        <ContentWidget titleName={<FormattedMessage id="MED001" />/* 교육등록관리 */} >
          <button type="submit" className={"btn btn-success"} onClick={this.onOpenModal.bind(this)}><FormattedMessage id="Registration" /></button>
        </ContentWidget>

        {/*<!-- Search Box -->*/}
        <ContentXearch
          subTitle={true}
          searchButton={true}
          optionsX={optionsX}
          errors={this.props.searchError}
          onChange={this.onChange}
          onSearch={this.onSearch} />

          <div className="col clo-12 w100 grid_top_wrap" style={{height : "100%"}}>
              <div className="jarviswidget-ctrls jarvis_btn fLeft category_tab_btn w100"  role="menu">
              <a className="col col-xs-6 col-sm-3 col-md-2 col-lg-2 btn btn-success fLeft active" id="" onClick={onClickTab} >전체보기</a>
                { searchTab && searchTab ? searchTab.map(function(sear,i){
                    return <a key={i} className="col col-xs-6 col-sm-3 col-md-2 col-lg-2 btn btn-success fLeft" id={sear.key} onClick={onClickTab} >{sear.value}</a>
                  }) :"" }
              <button onClick={this.handleLoadExcel} className={"btn btn-success fLeft"}>Excel</button>
              </div>
          </div>

        {/*<!-- Grid Content -->*/}
        <ContentTable
          paginationUse={true}
          currentPage={currentPage}
          onChangePage={this.onChangePage}
          onRowDoubleClick={this.handleRowDoubleClick}
          options={options}
          optionInit = {this.state.optionInit} />

        {/* 삭제 컨펌 모달 팝업 */} 
        <ConfirmModal 
          show={this.state.openConfirm}
          name={"openConfirm"}
          title={"교육삭제 확인"}
          confirmName={this.state.selected.trainingTitle}
          onDeleteModal={this.handleDelete}
          onCloseModal={this.onCloseConfirmModal}
        />

        {/* 등록 모달 팝업 */}
        <EnrollEduModal
          show={open}
          mode={mode}
          listCommons={listCommons}
          data={this.state.selected}
          name={"open_class_info"}
          errors={this.state.errorModal}
          duplicate={duplicate}
          onSearchCode={this.handleLoadCodeConfirm}
          onSearchCodeReturn={this.handleLoadCodeConfirmReturn}
          onChange={this.onChangeModal}
          onInsert={this.handleInsert}
          onUpdate={this.handleUpdate}
          onDelete={this.onOpenConfirmModal}
          // onDelete={this.handleDelete}
          onClose={this.onCloseModal} />

        {/* 승인관리 팝업 */}
        <EduApprovalModal
          show={openAPPRL}
          mode={mode}
          listCommons={listCommons}
          gridData = {this.state.modalStandAPPRL}  //모달 위 그리드 ---> 승인관리 조회
          // gridData2 = {this.state.modalCompltAPPRL} //모달 아래 그리드 --->승인완료 조회
          // data = {this.state.selected}
          gridSelectData = {this.state.gridSelectData} 
          data = {this.state.selected}
          name={"open_eduapproval_info"}
          currentPageModal={this.state.currentPageModal}
          currentPageModalSelect={this.state.currentPageModalSelect}
          onChangePageModal={this.onChangePageModal}
          onChangePageModalSelect={this.onChangePageModalSelect}
          errors={this.state.errorModal}
          onSearch={this.onSearch2}
          // onChangeTable={this.onChangeModalTable}
          // onClickAdd={this.handleRowClickModalAdd}
          // onClickDel={this.handleRowClickModalDel}
          onChange={this.onChange2}
          onInsert={this.handleInsert} 
          onUpdate={this.handleUpdateAPPRL}
          // onUpdateCancle={this.handleUpdateCancle}
          onDelete={this.handleDelete}
          onClose={this.onCloseAPPRL} />
          
      </React.Fragment>
    );
  };
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
    educationActions: bindActionCreators(educationActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  })
)(withRouter(EnrollEduContainer));