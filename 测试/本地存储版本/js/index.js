/*jshint esversion: 6 */

//1. 定义类创建学生对象
class Student {
    constructor(stuname, stuscore, salary) {
        this.stuname = stuname;
        this.stuscore = stuscore;
        this.salary = salary;
    }
}

//2. 获取标签信息
let stuname = document.querySelector('#username');
let score = document.querySelector('#score');
let salary = document.querySelector('#salary');
let btn = document.querySelector('.btn');
let tbody = document.querySelector('tbody');

//4. 点击添加按钮
btn.addEventListener('click', function () {
    let stu_v = stuname.value;
    let score_v = score.value;
    let salary_v = salary.value;
    if (stu_v == '') {
        alert('请输入姓名'); 
        return;
    } 
    //验证成绩和分数是否是数字
    if (isNaN(score_v) || isNaN(salary_v)) {
        alert('请输入合法数字!!!');
        score.value = '';
        salary.value = '';
    } else {
        // 创建学生对象
        let stu = new Student(stu_v, score_v, salary_v);
        // 将学生对象添加到本地存储中, 先获取本地存储数据
        let stuary = getData();
        // 将学生对象信息追加到本地存储中
        stuary.push(stu);
        // 将数据更新到本地存储中
        localStorage.setItem('stu', JSON.stringify(stuary));
        // 添加成功
        
        stuname.value = '';
        score.value = '';
        salary.value = '';
        alert('操作成功!!');
        // 动态渲染数据到表格中
        loadData_table();
        // 加载成绩统计图
        loadData_line();
        loadData_bar();
    }
});

//5. 获取本地存储数据
function getData() {
    let ary = localStorage.getItem('stu');
    if (ary) {
        return JSON.parse(ary);
    } else {
        return [];
    }
}

//6. 渲染数据到表格中
function loadData_table() {
    // 清空数据
    tbody.innerHTML = '';
    // 先获取数据
    let data_ary = getData();
    // 遍历数据并创建元素
    data_ary.forEach(function (item, index) {
        let tr = document.createElement('tr');
        tr.innerHTML = `
                     <td>${item.stuname}</td>
                     <td>${item.stuscore}</td>
                     <td>${item.salary}</td>
                     <td>
                        <a href="javascript:;" class="del"  data-msg="${index}">删除</a>
                     </td>
                `;
        tbody.appendChild(tr);
    });
}
loadData_table();


//7. 点击删除按钮
$(tbody).on('click', '.del', function () {
    if (confirm('确定要删除么?')) {
        // 获取索引
        let index = $(this).attr('data-msg');
        $(this).parents('tr').fadeOut('fast', 'linear', function () {
            // 获取当前删除按钮身上的自定义属性 index
            let ary = getData();
            ary.splice(index, 1);
            // 将删除后的数据更新到本地存储中
            localStorage.setItem('stu', JSON.stringify(ary));
            //重新渲染标签
            loadData_table();
            //加载成绩统计图
            loadData_line();
            loadData_bar();
        });
    }
});

//8. 封装功能获取学生姓名,分数,薪资
let getMsg = {
    getstuName: function () {
        // 保存学生姓名数组
        let stuary = [];
        // 遍历获取
        getData().forEach(function (item) {
            stuary.push(item.stuname);
        });
        // 返回学生姓名
        return stuary;
    },
    getscore: function () {
        // 保存学生成绩数组
        let stuary = [];
        // 遍历获取
        getData().forEach(function (item) {
            stuary.push(item.stuscore);
        });
        // 返回学生成绩
        return stuary;
    },
    getsalary: function () {
        // 保存学生薪资数组
        let stuary = [];
        // 遍历获取
        getData().forEach(function (item) {
            stuary.push(item.salary);
        })
        // 返回学生成绩
        return stuary;
    }
};
//9. 渲染数据到统计图中
function loadData_line() {
        let myChart = echarts.init(document.getElementById('line'));
        let option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                //显示学生姓名
                data: getMsg.getstuName(),
                lineStyle: {
                    color: 'blue'
                },
                axisLine: {
                    lineStyle: {
                        color: 'blue'
                    }
                    
                },
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'blue'
                    }
                },
            },
            series: [{
                //显示学生对应评分
                data: getMsg.getscore(),
                type: 'line',
                areaStyle: {}
            }]
        };
        myChart.setOption(option);
        if (getData().length == 0) {
            $("#line").removeAttr("_echarts_instance_").empty();
            
        }
}
loadData_line();

// 10. 渲染数据到柱状统计图中
function loadData_bar() {
    let myChart = echarts.init(document.getElementById('bar'));
    let option = {
        xAxis: {
            type: 'category',
            splitLine: {show: false},
            data: getMsg.getstuName()
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '生活费',
                type: 'bar',
                stack: '总量',
                label: {
                    show: true,
                    position: 'inside'
                },
                data: getMsg.getsalary()
            }
        ]
    };
    myChart.setOption(option);
    if (getData().length == 0) {
        $("#bar").removeAttr("_echarts_instance_").empty();
    }
}
loadData_bar();

