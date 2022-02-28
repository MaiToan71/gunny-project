var ViewModel = function () {
    var self = this;
    self.convertToKoObject = function (data) {
        var newObj = ko.mapping.fromJS(data);
        return newObj;
    }
    self.convertToJson = function (item) {
        if (item == null || item == "") {
            return [];
        } else {
            return JSON.parse(item);
        }
    };
    self.hours = ko.observableArray();
    self.getNumberOfDayById = function () {
        var pathname = window.location.pathname;
        var id = pathname.split('/')[pathname.split('/').length - 1]
        $.ajax({
            url: "/api/Date/" + id,
            type: 'get',
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                $('#date').val(data[0].Date);
                if (data[0].NumberOfTimes.length == 0) {
                    for (var i = 0; i <24; i++) {
                        var text = '';
                        text = i
                        if (i < 10) {
                            text = '0' + i
                        }
                        var obj = {
                            ID:0,
                            STT: i + 1,
                            DateId: id,
                            Name: `${text}:00`,
                            InputNumber: 0
                        }
                        self.hours.push(self.convertToKoObject(obj));
                    }
                } else {
                    $.each(data[0].NumberOfTimes, function (i, item) {
                        var text = '';
                        text = i
                        if (item.Name < 10) {
                            text = '0' + i
                        }
                        var obj = {
                            ID: item.Id,
                            STT: i + 1,
                            DateId: id,
                            Name: `${text}:00`,
                            InputNumber: item.InputNumber
                        }
                        self.hours.push(self.convertToKoObject(obj));
                    })
                }
                console.log(self.hours())
            },
            error: function (error) {
                console.log('fail');
            }
        });
    }
    self.update = function () {
        var array = [];
        $.each(self.hours(), function (ex, item) {
            var o = {
                ID: item.ID(),
                Name: Number(item.Name().split(':')[0]),
                DateId: item.DateId(),
                InputNumber: item.InputNumber()
            }
            array.push(o);
        }
        )

        $.ajax({
            url: "/api/Date/edit/" + array[0].DateId,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                Date: $('#date').val(),
                ID: array[0].DateId,
                Lists: array
            }),
            success: function (data) {
                self.getNumberOfDayById()
                toastr.success("Bạn đã thêm mới một trường dữ liệu", "Thành công!");
            },
            error: function (error) {
                console.log('fail');
            }
        });

    }


}
$(function () {
    var viewModel = new ViewModel();
    viewModel.getNumberOfDayById();
    ko.applyBindings(viewModel, document.getElementById('edit-date'));
});