myApp.controller('HomeController', function($scope, $location, $http, $filter){
	
	$scope.isLoad = false;
	
	// init
	$scope.sort = {       
		sortingOrder : 'id',
		reverse : false
	};
		
	$scope.gap = 5;
	
	$scope.filteredItems = [];
	$scope.groupedItems = [];
	$scope.itemsPerPage = 5;
	$scope.pagedItems = [];
	$scope.currentPage = 0;
	$scope.items = [];
	$scope.items=null;
	$scope.action='add';
	
	$scope.loadBooks = function(){
		$http.get("https://fakerestapi.azurewebsites.net/api/Books?api_key=/api/Books")
			.then(function(response) {
				$scope.books = response.data;
				console.log("books", $scope.books);
				$scope.isLoad = true;
				$scope.loadDataTable($scope.books);
		});
	}
	$scope.loadBooks();
	
	$scope.loadDataTable = function(books){
		
		$scope.items = books;
		
		// functions have been describe process the data for display
		$scope.search();
	}
    

    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            for(var attr in item) {
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sort.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };
    
  
    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];
        
        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };
    
    $scope.range = function (size,start, end) {
        var ret = [];        
        console.log(size,start, end);
                      
        if (size < end) {
            end = size;
            start = size-$scope.gap;
        }
        for (var i = start; i < end; i++) {
			if(i>=0)
            ret.push(i);
        }        
         console.log(ret);        
        return ret;
    };
    
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };
    
    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };
	
	$scope.delete=function (index) {
		
			if (confirm("Are you sure?")) {
				$http.delete("https://fakerestapi.azurewebsites.net/api/Books/"+$scope.items[index].ID+"?api_key=/api/Books")
				.then(function(response) {
					if(response.status===200){
					//removing element from array
					$scope.items.splice(index, 1);
					$scope.loadDataTable($scope.items);
					}
					else{
						alert("Error in delete "+response.status);
					}
			});
		}
	};
	$scope.edit=function(item,action){
		$scope.action="Edit";
		console.log(item);
		item.PublishDate=new Date(item.PublishDate);;
	    $scope.item=item;
		$scope.add(item,action);
	};
	$scope.add=function(item,action){
		if(action==='Edit' || action==='add' ){
			$http({
				method: 'POST',
				url: "https://fakerestapi.azurewebsites.net/api/Books?api_key=%2Fapi%2FBooks",
				data: item,
				headers: {'Content-Type': 'application/json'}
			}).then(function(response) {
				console.log("edit response");
				console.log(response);
				if(action==='add'){
					$scope.item.ID=$scope.items.length+1;
					$scope.items.push(item);
					$scope.loadDataTable($scope.items);
				}
			}, 
			function(response) { 
			});
		}
	};
	
	$scope.cancelEvent = function(){
		$scope.item = {
			'Title':'',
			'Description':'',
			'PublishDate':'',
			'Excerpt':'',
			'PageCount':''
		}
	}
	
	//logout will redirect to user on login page
	$scope.logout = function(){
		$location.path('/');
	}

});


myApp.$inject = ['$scope', '$filter'];


