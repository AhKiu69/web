
var dom=$('#msg')
    
    if (dom.scrollTop()<=0 || new_comer =='new'){
        
        PullToRefresh.init({
            mainElement:'#msg',
            instructionsPullToRefresh:'下拉获取更多信息',
            instructionsReleaseToRefresh:'可以松开啦',
            instructionsRefreshing:'读取中...',
            triggerElement: '#msg',
            onRefresh: function(){
                
            }()
        });
    }