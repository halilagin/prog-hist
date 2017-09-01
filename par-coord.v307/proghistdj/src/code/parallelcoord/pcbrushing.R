# vim: set tabstop=8 softtabstop=0 expandtab shiftwidth=4 smarttab:




ssIris <- function(){
    print ("spatialSignOfIris.started")
    library(caret)
    iris.data.df = read.csv("./iris.data.csv")
    iris.data.features = iris.data.df[, !colnames(iris.data.df) %in% c("t_set_ver_vir")]
    target = iris.data.df[, colnames(iris.data.df) %in% c("t_set_ver_vir")]
    iris.data.df=iris.data.features
    iris.data.trans= preProcess(iris.data.df, method=c("center", "scale"))
    iris.data.dfcentered=predict(iris.data.trans, iris.data.df)
    #f(iris.data.dfcentered$petal_len)

    iris.data.df_ss = lapply(iris.data.dfcentered, spatialSign)

    df = data.frame(iris.data.df_ss, target)
}

ssPlot<-function(x,y) {
    ## project points onto circle with radius r
    r=1
    p=sqrt(x^2+y^2)
    nx=(r/p)*x
    ny=(r/p)*y
    plot(nx, ny, asp=1)
}




#scatter plot matrix of spatial signed iris data
splomIris <- function(){
    library(lattice)
    ss = ssIris()
    m = data.matrix(ss)
    splom(a[,-5], col=a[,5])

    
    #plot(iris.data.df$petal_w, iris.data.df$petal_len)      
    #plot(iris.data.df_ss$sepal_len, iris.data.df_ss$sepal_w)       
    #plot(ss_sepal_len, ss_sepal_w) 
    #ss = data.frame(ss_sepal_len, ss_sepal_w)
    #featurePlot(m[,-5], m[,5], "pairs")
}


#projected to circle, plot matrix 
ssPlom <- function(df_){
df = df_[, !colnames(df_) %in% c("target")]
colsize = ncol(df)

par(mfrow=c(colsize,colsize))


for (n in names(df)){
    for (m in names(df)){
        if (n==m){
            plot(c(0), c(0), cex=0.1)
            text(0, 0, n, cex = 1.8)
        } else{
            ssPlot(df[[n]], df[[m]])
        }
    }
}

}



saveSSPlom <-function(){
png("iris.ssplom.png", width=15*300, height=15*300, res=600 )
ssPlom(ssIris())
dev.off()
}

#ssPlom(ssIris())
saveSSPlom()
