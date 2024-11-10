package it.polimi.productionoptimiserapi.security.services;

import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(email));

        List<UserRole> roles = user.getRole() == UserRole.ADMIN ?
                List.of(UserRole.ADMIN, UserRole.CUSTOMER) :
                List.of(UserRole.CUSTOMER);

        return new org.springframework.security.core.userdetails
                .User(email, user.getPassword(), roles.stream().map(userRole -> new SimpleGrantedAuthority(userRole.name())).toList());
    }
}
