const AuthLayout = ({
    children
} : {children: React.ReactNode}) => {
    return ( 
        <div className="auth-layout flex items-center justify-center h-full">
            <div className="auth-layout__content">
                {children}
            </div>
        </div>
     );
}
 
export default AuthLayout;