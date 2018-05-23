x=table2array(readtable('data.csv'));
h=plot(x);
h.YDataSource = 'x';



while true
    x=table2array(readtable('data.csv'));

    refreshdata;
    pause(0.1);
end